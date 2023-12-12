export interface MRegistrarValues {
  standardGovernor: string;
  zeroGovernor: string;
  emergencyGovernor: string;

  powerToken: string;
  zeroToken: string;
  vault: string;
}

export interface MRegistrarStore extends MRegistrarValues {
  registrar?: string;
  cashToken?: string;
}
