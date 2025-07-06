
#include <iostream>
#include <iomanip>
#include <chrono>

double calculate(int iterations, double param1, int param2) {
    double result = 1.0;
    for (int i = 1; i <= iterations; ++i) {
        double j = i * param1 - param2;
        result -= (1 / j);
        j = i * param1 + param2;
        result += (1 / j);
    }
    return result;
}

int main() {
    auto start_time = std::chrono::high_resolution_clock::now();
    double result = calculate(100000000, 4.0, 1) * 4;
    auto end_time = std::chrono::high_resolution_clock::now();

    std::cout << "Result: " << std::fixed << std::setprecision(12) << result << std::endl;
    std::cout << "Execution Time: " << std::fixed << std::setprecision(6) 
              << std::chrono::duration<double>(end_time - start_time).count() << " seconds" << std::endl;

    return 0;
}
