#include <iostream>
#include <chrono>
using namespace std;
using namespace chrono;

double calculate(long long iterations, double param1, double param2) {
    double result = 1.0;
    for (long long i = 1; i <= iterations; ++i) {
        double j = i * param1 - param2;
        result -= (1/j);

        j = i * param1 + param2;
        result += (1/j);
    }
    return result * 4.0;
}

int main() {
    auto start_time = high_resolution_clock::now();
    double result = calculate(100000000, 4, 1);
    auto end_time = high_resolution_clock::now();

    cout << "Result: " << fixed << setprecision(12) << result << endl;
    cout << "Execution Time: " << duration<double>(end_time - start_time).count() << " seconds" << endl;

    return 0;
}
