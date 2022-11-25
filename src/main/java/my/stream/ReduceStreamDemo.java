package my.stream;

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
    }
}
