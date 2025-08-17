import type { JSX } from "react";
import { Link } from "react-router";

export interface QuickActionProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}
export const QuickAction = ({ to, icon, title, description }: QuickActionProps): JSX.Element => (
  <Link
    to={to}
    className="group  mt-4 bg-opacity/20  backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-30 transform hover:scale-105 transition-all duration-300 block"
  >
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4 group-hover:bg-opacity-30">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-blue-100">{description}</p>
    </div>
  </Link>
);
