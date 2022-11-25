package my.collection;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @ClassName SubListClear test
 * @Description TODO
 * @Author shuai.pan
 * @Date 2022-11-21 10:05
 * @Version 1.0
 */
public class SubListClear {

    public static void main(String[] args) {
        explicitRange();
    }

    /**
     * aList = [1, 2, 3, 4, 5, 6, 7]
     * aList = [1, 2, 4, 3, 5, 6, 7]
     * aList = [1, 2, 5, 6, 7]
     */
    public static void explicitRange() {
        List<Integer> aList = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7));
        System.out.println("aList = " + aList);
        List<Integer> integers = aList.subList(1, 5);
        Collections.shuffle(integers);
        integers.add(8);
        integers.add(9);
        System.out.println("aList = " + aList);
        integers.clear();
        System.out.println("aList = " + aList);
    }
}
