
#include <iostream>
#include <iomanip>
#include <chrono>

double calculate(long long iterations, double param1, double param2) {
    double result = 1.0;
    // Use long double if higher precision needed
    for (long long i = 1; i <= iterations; ++i) {
        double j = static_cast<double>(i) * param1 - param2;
        result -= 1.0 / j;
        j = static_cast<double>(i) * param1 + param2;
        result += 1.0 / j;
    }
    return result;
}

int main() {
    auto start_time = std::chrono::high_resolution_clock::now();

    double result = calculate(100000000LL, 4.0, 1.0) * 4.0;

    auto end_time = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double> diff = end_time - start_time;

    std::cout << std::fixed << std::setprecision(12);
    std::cout << "Result: " << result << std::endl;
    std::cout << "Execution Time: " << diff.count() << " seconds" << std::endl;
    return 0;
}
