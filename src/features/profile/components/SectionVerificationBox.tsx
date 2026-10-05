import React from "react";
import {
  SectionVerificationModal,
  SectionVerificationModalProps,
} from "./SectionVerificationModal";

export { SectionVerificationModal };
export type { SectionVerificationModalProps };

// Compatibility alias
export const SectionVerificationBox: React.FC<
  Omit<SectionVerificationModalProps, "isOpen" | "onClose"> & {
    isOpen?: boolean;
    onClose?: () => void;
  }
> = ({ isOpen = false, onClose = () => {}, ...rest }) => {
  return <SectionVerificationModal isOpen={isOpen} onClose={onClose} {...rest} />;
};
