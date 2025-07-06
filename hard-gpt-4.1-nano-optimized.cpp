
#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <limits>
#include <chrono>

uint32_t lcg_next(uint32_t& seed, uint32_t a=1664525, uint32_t c=1013904223, uint32_t m=0xFFFFFFFF) {
    seed = a * seed + c;
    return seed;
}

int64_t max_subarray_sum(int n, uint32_t seed, int min_val, int max_val) {
    std::vector<int64_t> random_numbers(n);
    for (int i = 0; i < n; ++i) {
        uint32_t rand_val = lcg_next(seed);
        int range = max_val - min_val + 1;
        int64_t num = (rand_val % range) + min_val;
        random_numbers[i] = num;
    }
    int64_t max_sum = std::numeric_limits<int64_t>::min();
    for (int i = 0; i < n; ++i) {
        int64_t current_sum = 0;
        for (int j = i; j < n; ++j) {
            current_sum += random_numbers[j];
            if (current_sum > max_sum) {
                max_sum = current_sum;
            }
        }
    }
    return max_sum;
}

int64_t total_max_subarray_sum(int n, uint32_t initial_seed, int min_val, int max_val) {
    int64_t total_sum = 0;
    uint32_t seed = initial_seed;
    for (int i = 0; i < 20; ++i) {
        uint32_t seed_val = lcg_next(seed);
        total_sum += max_subarray_sum(n, seed_val, min_val, max_val);
    }
    return total_sum;
}

int main() {
    const int n = 10000;
    const uint32_t initial_seed = 42;
    const int min_val = -10;
    const int max_val = 10;

    auto start_time = std::chrono::high_resolution_clock::now();
    int64_t result = total_max_subarray_sum(n, initial_seed, min_val, max_val);
    auto end_time = std::chrono::high_resolution_clock::now();

    std::chrono::duration<double> elapsed = end_time - start_time;
    std::cout << "Total Maximum Subarray Sum (20 runs): " << result << std::endl;
    std::cout << "Execution Time: " << std::fixed << std::setprecision(6) << elapsed.count() << " seconds" << std::endl;

    return 0;
}
