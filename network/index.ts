import production from "./production.config";
import staging from "./staging.config";
import development from "./development.config";
import local from "./local.config";
export * from "./types.d";

const getNetworkConfig = () => {
  const config = useRuntimeConfig();
  const { node, build } = config.public.env;

  if (build) {
    if (build === "production") return production;
    if (build === "staging") return staging;
    if (build === "development") return development;
    else return local;
  }

  if (node === "production") return production;
  if (node === "development") return development;

  return local;
};

export { production, staging, development, local, getNetworkConfig };
