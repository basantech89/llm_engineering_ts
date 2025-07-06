
#include <iostream>
#include <iomanip> // for iomanip
#include <chrono>

// Using double precision to avoid integer overflows
using double Precision = long double;

double calculate(double iterations, double param1, double param2) {
    double result = 0.0;
    for (int64_t i = 1; i <= iterations; ++i) {
        double j = i * param1 - param2;
        // Avoiding division by zero
        if (j == 0.0)
            continue;

        result -= 1.0 / j;
        j = i * param1 + param2;
        if (j == 0.0) // Check for potential division by zero
            continue;

        result += 1.0 / j;
    }
    return result * param1; // Multiplying with param1 as per original Python code
}

int main() {
    auto start_time = std::chrono::high_resolution_clock::now();
    double result = calculate(100_000_000, 4.0, 1.0);
    auto end_time = std::chrono::high_resolution_clock::now();

    // Displaying the results with high precision
    std::cout << "Result: " << std::fixed << std::setprecision(12) << result << "\n";
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end_time - start_time).count();
    std::cout << "Execution Time: " << std::fixed << std::setprecision(6) << (duration / 1000.0) << " seconds" << "\n";

    return 0;
}
