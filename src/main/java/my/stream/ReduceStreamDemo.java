package my.stream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @ClassName ReduceStreamDemo
 * @Description TODO
 * @Author Administrator
 * @Date 2022-09-29 11:48
 * @Version 1.0
 */
public class ReduceStreamDemo {
    public static void main(String[] args) {
        Integer[] ints = {0, 1, 2, 3};
        List<Integer> list = Arrays.asList(ints);

        Optional<Integer> optional = list.stream().reduce((a, b) -> a + b);
        Optional<Integer> optional1 = list.stream().reduce(Integer::sum);
        Integer sum = list.stream().mapToInt(a->a).sum();
        System.out.println(optional.orElse(0));
        System.out.println(optional1.orElse(0));
        System.out.println(sum);

        int reduce = list.stream().reduce(6, (a, b) -> a + b);
        System.out.println(reduce);
        int reduce1 = list.stream().reduce(6, Integer::sum);
        System.out.println(reduce1);

        listsReduce();
    }

    private static void listsReduce() {
        List<Integer> a = Arrays.asList(1, 2, 3, 44);
        List<Integer> b = Arrays.asList(1, 2, 33, 44);
        List<Integer> c = Arrays.asList(1, 22, 33, 44);
        List<List<Integer>> lists = Arrays.asList(a, b, c);
        List<Integer> abc = lists.stream().reduce(new ArrayList<>(16), (k1, k2) -> {
            k1.addAll(k2);
            return k1;
        });

        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = " + c);
        System.out.println("abc = " + abc);


    }
}
