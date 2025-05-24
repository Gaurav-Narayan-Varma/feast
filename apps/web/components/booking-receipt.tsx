type Item = {
  recipe: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

export default function BookingReceipt({
  chefId,
  chefName,
  items,
  totalAmount,
  appointmentAt,
}: {
  chefId: string;
  chefName: string;
  items: Item[];
  totalAmount: number;
  appointmentAt: string;
}) {
  const appointmentDate = new Date(appointmentAt);
  const appointmentDateString = appointmentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="flex flex-col gap-4 bg-ds-chef-50 p-4 rounded-lg text-sm">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 items-center">
          Chef:
          <a
            href={`/chefs/${chefId}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {chefName}
          </a>
        </div>
        <p>Appointment Date: {appointmentDateString}</p>
      </div>
      <div>
        <p>Dishes:</p>
        <ul className="list-disc list-inside">
          {items.map((item) => (
            <li key={item.recipe.id} className="ml-4">
              {item.recipe.name} / ${item.recipe.price} each / x {item.quantity}{" "}
              ordered
            </li>
          ))}
        </ul>
      </div>
      <p>Total: ${totalAmount}</p>
    </div>
  );
}
