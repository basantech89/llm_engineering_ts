
#include <iostream>
#include <chrono>

using namespace std;

// Define a type for high-precision floating point numbers (arbitrary precision)
typedef long double float64;

float64 calculate(int iterations, float64 param1, float64 param2) {
    float64 result = 0.0;
    for (int i = 1; i <= iterations; ++i) {
        // Calculate j using the formula with high-precision arithmetic to prevent overflow
        float64 j1 = i * param1 - param2;
        float64 j2 = i * param1 + param2;

        // Subtract and add the reciprocals of j1 and j2, respectively
        result += (1.0 / j1) - (1.0 / j2);
    }
    return result * 4.0; // Multiply by 4 as specified in the original Python code
}

int main() {
    auto start_time = chrono::high_resolution_clock::now();
    float64 result = calculate(100_000_000, 4.0, 1.0);
    auto end_time = chrono::high_resolution_clock::now();

    // Print the results
    cout << fixed << setprecision(12) << "Result: " << result << endl;
    auto duration = chrono::duration_cast<chrono::microseconds>(end_time - start_time).count();
    cout << "Execution Time: " << (double)duration / 1000000.0 << " milliseconds" << endl;

    return 0;
}
