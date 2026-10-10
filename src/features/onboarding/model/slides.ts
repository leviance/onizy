import type { TranslationKey } from '@/shared/i18n';

type OnboardingSlide = {
  title: TranslationKey;
  description: TranslationKey;
};

export const onboardingSlides = [
  { title: 'onboarding.welcomeTitle', description: 'onboarding.welcomeDescription' },
  { title: 'onboarding.captureTitle', description: 'onboarding.captureDescription' },
  { title: 'onboarding.practiceTitle', description: 'onboarding.practiceDescription' },
  { title: 'onboarding.reviewTitle', description: 'onboarding.reviewDescription' },
] as const satisfies readonly OnboardingSlide[];
