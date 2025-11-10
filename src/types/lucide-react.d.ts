declare module "lucide-react" {
  import { FC, SVGProps } from "react";
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    strokeWidth?: string | number;
  }
  export const LogOut: FC<IconProps>;
  export const Trash2: FC<IconProps>;
  export const User: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Phone: FC<IconProps>;
  export const MapPin: FC<IconProps>;
  export const Building2: FC<IconProps>;
  export const Save: FC<IconProps>;
  export const X: FC<IconProps>;
  export const File: FC<IconProps>;
  export const Edit2: FC<IconProps>;
  export const Settings: FC<IconProps>;
}

