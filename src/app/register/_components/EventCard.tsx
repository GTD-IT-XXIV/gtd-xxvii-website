type EventCardProps = {
  title: string;
  description: string;
  price: string;
  selected: boolean;
  onClick: () => void;
};

export default function EventCard({title, description, price, selected, onClick}: EventCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 border rounded-lg cursor-pointer transition-all ${
        selected
          ? "border-indigo-600 ring-2 ring-indigo-600"
          : "border-gray-200 hover:border-indigo-400"
      }`}
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <p className="mt-2 text-sm font-medium text-indigo-600">{price}</p>
    </div>
  );
}
