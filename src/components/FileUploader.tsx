'use client';

type Props = {
  label: string;
  onUpload: (file: File) => void;
};

export default function FileUploader({ label, onUpload }: Props) {
  return (
    <div className="border border-dashed border-gray-400 p-4 rounded-md text-center bg-white">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
        className="w-full"
      />
    </div>
  );
}
