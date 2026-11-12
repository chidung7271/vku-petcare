import { Test, TestingModule } from '@nestjs/testing';
import { EmergencySafetyService } from './emergency-safety.service';

describe('EmergencySafetyService', () => {
  let service: EmergencySafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmergencySafetyService],
    }).compile();

    service = module.get<EmergencySafetyService>(EmergencySafetyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should classify critical poisoning symptoms as RED triage tier', () => {
    const assessment = service.evaluateTriage({
      problem: 'Chó bị ngộ độc ăn phải bả chuột',
      symptoms: 'sùi bọt mép, nôn mửa, co giật',
    });

    expect(assessment.colorCode).toBe('RED');
    expect(assessment.severity).toBe('CRITICAL');
    expect(assessment.immediateActions.length).toBeGreaterThan(0);
    expect(assessment.doNotDo.length).toBeGreaterThan(0);
    expect(assessment.redFlags.length).toBeGreaterThan(0);
  });

  it('should classify choking and respiratory distress as RED triage tier', () => {
    const assessment = service.evaluateTriage({
      problem: 'Chó bị hóc dị vật xương',
      symptoms: 'khó thở, tím tái nướu lợi',
    });

    expect(assessment.colorCode).toBe('RED');
    expect(assessment.immediateActions).toContainEqual(
      expect.stringContaining('thủ thuật Heimlich'),
    );
  });

  it('should classify general symptoms or chocolate ingestion as YELLOW triage tier', () => {
    const assessment = service.evaluateTriage({
      problem: 'Chó ăn phải một thanh socola sữa nhỏ',
      symptoms: 'nôn nhẹ 1 lần, vẫn chạy nhảy',
    });

    expect(assessment.colorCode).toBe('YELLOW');
    expect(assessment.immediateActions.length).toBeGreaterThan(0);
  });

  it('should classify minor non-emergency symptom as GREEN triage tier', () => {
    const assessment = service.evaluateTriage({
      problem: 'Mèo bị ngứa gãi tai nhiều ngày',
      symptoms: 'rụng lông nhẹ quanh vành tai',
    });

    expect(assessment.colorCode).toBe('GREEN');
    expect(assessment.severity).toBe('LOW');
  });

  it('should detect and BLOCK dangerous home remedies like raw eggs, salt, or human paracetamol', () => {
    const safety1 = service.validateAdvice('Cho chó uống nước muối đậm đặc để ép nôn');
    expect(safety1.isSafe).toBe(false);
    expect(safety1.violations.length).toBeGreaterThan(0);

    const safety2 = service.validateAdvice('Cho uống Paracetamol hạ sốt liều trẻ em');
    expect(safety2.isSafe).toBe(false);

    const safety3 = service.validateAdvice('Nuốt trứng gà sống để giải độc thuốc chuột');
    expect(safety3.isSafe).toBe(false);
  });

  it('should pass safe veterinary guidance', () => {
    const safety = service.validateAdvice(
      'Giữ thú cưng ở nơi yên tĩnh, thoáng mát, dùng khăn ẩm lau vùng bẹn và nhanh chóng liên hệ phòng khám thú y gần nhất.',
    );
    expect(safety.isSafe).toBe(true);
    expect(safety.violations.length).toBe(0);
  });
});
