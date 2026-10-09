import React from 'react';
import { AbhaStatus, CareContextStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: AbhaStatus | CareContextStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'VERIFIED':
      case 'LINKED':
      case 'CONSENT_GRANTED':
      case 'GRANTED':
      case 'COMPLETED':
      case 'RELEASED':
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'VERIFICATION_PENDING':
      case 'CARE_CONTEXT_LINK_PENDING':
      case 'LINK_PENDING':
      case 'CONSENT_PENDING':
      case 'REQUESTED':
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'ORDERED':
      case 'PROCESSING':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'VERIFICATION_REQUIRED':
      case 'ACTION_REQUIRED':
      case 'DISCOVERED':
        return 'bg-blue-50 text-primary border-blue-200';

      case 'CONSENT_DENIED':
      case 'DENIED':
      case 'CONSENT_REVOKED':
      case 'REVOKED':
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      case 'NOT_CONNECTED':
      case 'NOT_LINKED':
      case 'INTEGRATION_UNAVAILABLE':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getLabel = (st: string) => {
    switch (st) {
      case 'NOT_CONNECTED':
        return 'Not connected';
      case 'VERIFICATION_REQUIRED':
        return 'Verification required';
      case 'VERIFICATION_PENDING':
        return 'Verification pending';
      case 'VERIFIED':
        return 'Verified';
      case 'CARE_CONTEXT_LINK_PENDING':
        return 'Care context linking pending';
      case 'LINKED':
        return 'Linked';
      case 'LINK_PENDING':
        return 'Linking pending';
      case 'DISCOVERED':
        return 'Discovered (Ready to Link)';
      case 'CONSENT_PENDING':
        return 'Consent pending';
      case 'CONSENT_GRANTED':
      case 'GRANTED':
        return 'Consent granted';
      case 'CONSENT_DENIED':
      case 'DENIED':
        return 'Consent denied';
      case 'CONSENT_REVOKED':
      case 'REVOKED':
        return 'Consent revoked';
      case 'INTEGRATION_UNAVAILABLE':
        return 'Integration unavailable';
      case 'ACTION_REQUIRED':
        return 'Action required';
      default:
        return st.replace(/_/g, ' ');
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-xs ${getBadgeStyle(
        status
      )} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {getLabel(status)}
    </span>
  );
};
