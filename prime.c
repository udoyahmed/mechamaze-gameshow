#include <stdio.h>
#include <math.h>

int main() {
	int n = 0;
	for (int i = 2;;i++) {
		if(n == 1000) break;
		int flag = 0;
		for (int j = 2; j <= sqrt(i); j++) {
			if (!(i % j)) { 
				flag = 1;
				n++;
				break;
			}
		}
		if (!flag) printf("%d\n", i);
	}
	return 0;
}
