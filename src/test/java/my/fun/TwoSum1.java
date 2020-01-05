package my.fun;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

public class TwoSum1 {

    @Test
    public void testMain() {
        int[] a = {3, 2, 4};
        System.out.println(twoSum2(a, 6));
    }

    public int[] twoSum2(int[] nums, int target) {
        int[] ret = new int[2];
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    ret[0] = i;
                    ret[1] = j;
                    break;
                }
            }
        }
        return ret;
    }

    public int[] twoSum1(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>(nums.length);
        for (int i = 0; i < nums.length; i++) {
            map.put(nums[i], i);
        }
        int[] ret = new int[2];
        for (int i = 0; i < nums.length; i++) {
            map.put(nums[i], null);
            if (map.get(target - nums[i]) != null) {
                ret[0] = i;
                ret[1] = map.get(target - nums[i]);
                break;
            }
            map.put(nums[i], i);
        }
        return ret;
    }
}
