import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { Location, LocationDocument, LocationTypeEnum } from './schemas/location.schema';
import { FavoriteLocation, FavoriteLocationDocument } from './schemas/location.schema';
import { QueryNearbyLocationsDto } from './dto/query-location.dto';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    @InjectModel(FavoriteLocation.name) private favoriteModel: Model<FavoriteLocationDocument>,
    private readonly configService: ConfigService,
  ) {}

  async findNearby(queryDto: QueryNearbyLocationsDto) {
    const provider = this.configService.get<string>('LOCATION_PROVIDER', 'mock');
    const googleApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') || this.configService.get<string>('GEMINI_API_KEY');

    // 1. Try Google Places if configured and GPS coordinates are provided
    if (provider === 'google_places' && queryDto.lat && queryDto.lng && googleApiKey) {
      try {
        const googleResults = await this.fetchFromGooglePlaces(
          queryDto.lat,
          queryDto.lng,
          queryDto.radius || 15,
          googleApiKey,
          queryDto.type,
          queryDto.search,
        );
        if (googleResults && googleResults.length > 0) {
          this.logger.log(`[GooglePlaces] Successfully fetched ${googleResults.length} live places for (${queryDto.lat}, ${queryDto.lng}) with type=${queryDto.type || 'ALL'}`);
          return googleResults;
        }
      } catch (err: any) {
        this.logger.warn(`[GooglePlaces] Fetch failed: ${err.message}. Falling back to internal database.`);
      }
    }

    // 2. Fallback to MongoDB / Mock Database
    const filter: any = {};
    if (queryDto.type) {
      filter.type = queryDto.type;
    }
    if (queryDto.search) {
      filter.$or = [
        { name: { $regex: queryDto.search, $options: 'i' } },
        { address: { $regex: queryDto.search, $options: 'i' } },
      ];
    }

    const locations = await this.locationModel.find(filter).exec();

    let results = locations.map((loc) => {
      const locObj: any = loc.toObject();
      if (queryDto.lat !== undefined && queryDto.lng !== undefined) {
        locObj.distance = calculateDistanceKm(queryDto.lat, queryDto.lng, loc.latitude, loc.longitude);
      } else {
        locObj.distance = 0;
      }
      locObj.source = 'database';
      return locObj;
    });

    // Filter by radius if GPS provided
    if (queryDto.lat !== undefined && queryDto.lng !== undefined && queryDto.radius) {
      results = results.filter((loc) => loc.distance <= queryDto.radius);
    }

    // Sort: 24/7 hospitals first, then nearest distance
    results.sort((a, b) => {
      if (a.is24Hours !== b.is24Hours) {
        return a.is24Hours ? -1 : 1;
      }
      return (a.distance || 0) - (b.distance || 0);
    });

    return results;
  }

  private async fetchFromGooglePlaces(
    lat: number,
    lng: number,
    radiusKm: number,
    apiKey: string,
    requestedType?: string,
    searchQuery?: string,
  ): Promise<any[]> {
    const radiusMeters = Math.min(radiusKm * 1000, 50000);

    let includedTypes = ['veterinary_care', 'pet_store'];
    if (requestedType === LocationTypeEnum.PET_STORE) {
      includedTypes = ['pet_store'];
    }

    // Try Google Places API (New) first
    try {
      const newPlacesUrl = 'https://places.googleapis.com/v1/places:searchNearby';
      const response = await fetch(newPlacesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.regularOpeningHours,places.types',
        },
        body: JSON.stringify({
          includedTypes,
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusMeters,
            },
          },
        }),
      });

      const data = await response.json();
      if (response.ok && data.places && data.places.length > 0) {
        let mapped = data.places.map((place: any) => {
          const name = place.displayName?.text || 'Cơ sở thú y';
          const nameLower = name.toLowerCase();
          const is24h = place.regularOpeningHours?.periods?.some((p: any) => p.open?.hour === 0 && !p.close) ||
                        nameLower.includes('24h') || nameLower.includes('24/7') || nameLower.includes('24/24');

          let detectedType: string = LocationTypeEnum.VET_CLINIC;
          if (is24h || nameLower.includes('bệnh viện') || nameLower.includes('hospital')) {
            detectedType = LocationTypeEnum.VET_HOSPITAL;
          } else if (nameLower.includes('spa') || nameLower.includes('grooming') || nameLower.includes('cắt tỉa') || nameLower.includes('làm đẹp')) {
            detectedType = LocationTypeEnum.GROOMING;
          } else if (place.types?.includes('pet_store') || nameLower.includes('pet mart') || nameLower.includes('pet shop') || nameLower.includes('cửa hàng') || nameLower.includes('siêu thị')) {
            detectedType = LocationTypeEnum.PET_STORE;
          }

          return {
            _id: place.id,
            name,
            type: detectedType,
            latitude: place.location?.latitude || lat,
            longitude: place.location?.longitude || lng,
            address: place.formattedAddress || 'Địa chỉ lân cận',
            phone: place.nationalPhoneNumber || 'Đang cập nhật SĐT',
            rating: place.rating || 4.8,
            reviewsCount: place.userRatingCount || 10,
            is24Hours: is24h,
            isOpenNow: place.regularOpeningHours?.openNow ?? true,
            openingHours: is24h ? 'Mở cửa 24/7' : (place.regularOpeningHours?.openNow ? 'Đang mở cửa' : 'Đã đóng cửa'),
            distance: calculateDistanceKm(lat, lng, place.location?.latitude || lat, place.location?.longitude || lng),
            source: 'google_places',
          };
        });

        // Filter by requested category if provided
        if (requestedType) {
          if (requestedType === LocationTypeEnum.VET_HOSPITAL) {
            mapped = mapped.filter((p: any) => p.is24Hours || p.type === LocationTypeEnum.VET_HOSPITAL);
          } else {
            mapped = mapped.filter((p: any) => p.type === requestedType);
          }
        }

        // Filter by search query if provided
        if (searchQuery && searchQuery.trim()) {
          const sq = searchQuery.toLowerCase().trim();
          mapped = mapped.filter((p: any) => p.name.toLowerCase().includes(sq) || p.address.toLowerCase().includes(sq));
        }

        mapped.sort((a: any, b: any) => a.distance - b.distance);
        return mapped;
      }

      if (data.error) {
        this.logger.debug(`[GooglePlaces New] ${data.error.message}, trying legacy search...`);
      }
    } catch (e: any) {
      this.logger.debug(`[GooglePlaces New Error] ${e.message}`);
    }

    // Fallback to Google Places Legacy API
    try {
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=veterinary_care&keyword=thú+y&key=${apiKey}&language=vi`;
      const legacyRes = await fetch(legacyUrl);
      const legacyData = await legacyRes.json();

      if (legacyData.status === 'OK' && legacyData.results && legacyData.results.length > 0) {
        return legacyData.results.map((item: any) => ({
          _id: item.place_id,
          name: item.name,
          type: item.types?.includes('pet_store') ? LocationTypeEnum.PET_STORE : LocationTypeEnum.VET_HOSPITAL,
          latitude: item.geometry?.location?.lat,
          longitude: item.geometry?.location?.lng,
          address: item.vicinity || 'Địa chỉ lân cận',
          phone: 'Xem trên Google Maps',
          rating: item.rating || 4.7,
          reviewsCount: item.user_ratings_total || 25,
          is24Hours: false,
          isOpenNow: item.opening_hours?.open_now ?? true,
          openingHours: item.opening_hours?.open_now ? 'Đang mở cửa' : 'Đã đóng cửa',
          distance: calculateDistanceKm(lat, lng, item.geometry?.location?.lat || lat, item.geometry?.location?.lng || lng),
          source: 'google_places',
        }));
      }

      if (legacyData.error_message) {
        this.logger.warn(`[GooglePlaces Legacy] Error: ${legacyData.error_message}`);
      }
    } catch (e: any) {
      this.logger.warn(`[GooglePlaces Legacy Error] ${e.message}`);
    }

    return [];
  }

  async findById(id: string): Promise<LocationDocument> {
    const loc = await this.locationModel.findById(id).exec();
    if (!loc) {
      throw new NotFoundException('Không tìm thấy cơ sở thú y');
    }
    return loc;
  }

  async addFavorite(userId: string, locationId: string) {
    await this.findById(locationId);

    const existing = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      locationId: new Types.ObjectId(locationId),
    }).exec();

    if (existing) {
      return { success: true, message: 'Đã lưu trong danh sách yêu thích' };
    }

    const fav = new this.favoriteModel({
      userId: new Types.ObjectId(userId),
      locationId: new Types.ObjectId(locationId),
    });
    await fav.save();
    return { success: true, message: 'Đã thêm vào cơ sở yêu thích' };
  }

  async removeFavorite(userId: string, locationId: string) {
    await this.favoriteModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      locationId: new Types.ObjectId(locationId),
    }).exec();
    return { success: true, message: 'Đã xóa khỏi cơ sở yêu thích' };
  }

  async getFavorites(userId: string) {
    const favs = await this.favoriteModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('locationId')
      .exec();

    return favs.map((f) => f.locationId).filter(Boolean);
  }
}
