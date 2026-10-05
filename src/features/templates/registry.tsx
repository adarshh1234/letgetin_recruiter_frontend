import React from 'react';
import { IResume } from '../resume/types';
import { ModernSleekTemplate } from './components/ModernSleekTemplate';
import { ClassicAtsTemplate } from './components/ClassicAtsTemplate';
import { MinimalCleanTemplate } from './components/MinimalCleanTemplate';
import { ExecutiveProTemplate } from './components/ExecutiveProTemplate';

export interface TemplateProps {
  resume: IResume;
}

export const getTemplateComponent = (templateId: string): React.FC<TemplateProps> => {
  switch (templateId) {
    case 'modern-sleek':
      return ModernSleekTemplate;
    case 'classic-ats':
      return ClassicAtsTemplate;
    case 'minimal-clean':
      return MinimalCleanTemplate;
    case 'executive-pro':
      return ExecutiveProTemplate;
    default:
      return ModernSleekTemplate;
  }
};
