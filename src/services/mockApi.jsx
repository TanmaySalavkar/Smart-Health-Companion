export const getDoctors = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 20% chance to fail to demonstrate error states and offline cache
      if (Math.random() > 0.8) {
        reject(new Error("Network Error: Could not fetch doctors."));
      } else {
        resolve([
          {
            id: 1,
            name: "Dr. Sharma",
            specialization: "Cardiologist",
            rating: 4.5,
          },
          {
            id: 2,
            name: "Dr. Mehta",
            specialization: "Dermatologist",
            rating: 4.2,
          },
          {
            id: 3,
            name: "Dr. Roberts",
            specialization: "Neurologist",
            rating: 4.8,
          },
          {
            id: 4,
            name: "Dr. Lee",
            specialization: "Pediatrician",
            rating: 4.6,
          },
        ]);
      }
    }, 1200); // 1.2 second simulated network delay
  });
};