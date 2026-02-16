function Result({ commission }) {
  return (
    <div className="mt-6 border border-green-600 bg-green-600/10 rounded-lg p-4">
      <p className="text-green-400 text-sm">
        Commission Earned
      </p>
      <h2 className="text-green-300 text-2xl font-bold mt-1">
        ₹{commission}
      </h2>
    </div>
  );
}

export default Result;
