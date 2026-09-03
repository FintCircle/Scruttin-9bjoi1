import { useLocalStorage } from './useLocalStorage';

export interface OnboardingProfile {
  name: string;
  location: string;
  expertise: string[];
  industries: string[];
  completed: boolean;
}

const DEFAULT_PROFILE: OnboardingProfile = {
  name: '',
  location: '',
  expertise: [],
  industries: [],
  completed: false,
};

export function useOnboarding() {
  const [profile, setProfile] = useLocalStorage<OnboardingProfile>(
    'scruttin-onboarding',
    DEFAULT_PROFILE
  );

  const completeOnboarding = (data: Omit<OnboardingProfile, 'completed'>) => {
    setProfile({ ...data, completed: true });
  };

  const resetOnboarding = () => {
    setProfile(DEFAULT_PROFILE);
  };

  return { profile, completeOnboarding, resetOnboarding };
}
