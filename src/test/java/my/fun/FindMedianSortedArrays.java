package my.fun;

public class FindMedianSortedArrays {

    public static void main(String[] args) {
        int[] a = {1, 2};
        int[] b = {1,1};
        System.out.println(new FindMedianSortedArrays().findMedianSortedArrays(a, b));
    }

    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        double ret = 0;
        int sum = nums1.length + nums2.length;
        int i = 0, j = 0;
        if ((sum & 1) == 1) {
            sum >>= 1;
            for (; ; sum--) {
                if (0 == sum) {
                    ret = 0.00 + getMix(i != nums1.length ? nums1[i] : nums2[j], j != nums2.length ? nums2[j] : nums1[i]);
                    break;
                }
                if (i >= nums1.length) {
                    j++;
                } else if (j >= nums2.length) {
                    i++;
                } else if (nums1[i] < nums2[j]) {
                    i++;
                } else {
                    j++;
                }
            }
        } else {
            sum = sum / 2 - 1;
            for (; ; sum--) {
                if (0 == sum) {
                    ret = (0.00 + (i != nums1.length ? nums1[i] : nums2[j + 1]) + (j != nums2.length ? nums2[j] : nums1[i + 1])) / 2;
                    break;
                }
                if (i >= nums1.length) {
                    j++;
                } else if (j >= nums2.length) {
                    i++;
                } else if (nums1[i] < nums2[j]) {
                    i++;
                } else {
                    j++;
                }

            }
        }
        return ret;
    }


    private int getMix(int a, int b) {
        return a < b ? a : b;
    }

    private int getMax(int a, int b) {
        return a > b ? a : b;
    }

}
