type Location = "city" | "suburb" | "rural";

export const calculateFee = (weight: number, location: Location): number => {
    if (weight <= 0) {
        throw new Error("Weight must be greater than zero");
    }

    const baseFees: Record<Location, number> = {
        city: 30,
        suburb: 50,
        rural: 70,
    };

    const perKgRate = 10;

    const baseFee = baseFees[location];

    if (!baseFee) {
        throw new Error("Invalid location");
    }

    const totalFee = baseFee + weight * perKgRate;

    return totalFee;
};
