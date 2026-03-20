import { cloneElement } from "react";
import { X } from "lucide-react";

const FileCard = ({ file, name, onRemove, removeTrigger }) => {
  if (!file) return null;

  const displayName = name || file.name;

  const truncatedName =
    displayName.length > 30 ? displayName.slice(0, 27) + "..." : displayName;

  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  const removeElement = removeTrigger
    ? cloneElement(removeTrigger, { onClick: onRemove })
    : onRemove && (
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <X size={18} />
        </button>
      );

  return (
    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-xl">
      <div className="flex flex-col overflow-hidden">
        <span
          className="text-sm font-medium text-gray-800 truncate max-w-55"
          title={displayName}
        >
          {truncatedName}
        </span>

        <span className="text-xs text-gray-500">{sizeMB} MB</span>
      </div>

      {removeElement}
    </div>
  );
};

export { FileCard };
