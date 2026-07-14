interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-[#1E1B4B] mb-1.5"
      >
        {label}
        {required && <span className="text-[#7C3AED] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}

/* Shared input class names */
export const inputClassName =
  "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-colors";

export const selectClassName =
  "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1E1B4B] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-colors appearance-none";

export const textareaClassName =
  "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 focus:border-[#7C3AED] transition-colors resize-none";
