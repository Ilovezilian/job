package my.stream;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName MatchStreamDemo
 * @Description TODO
 * @Author Administrator
 * @Date 2022-09-29 11:49
 * @Version 1.0
 */
public class MatchStreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("周杰伦");
        list.add("王力宏");
        list.add("陶喆");
        list.add("林俊杰");

        boolean anyMatchFlag = list.stream().anyMatch(element -> element.contains("王"));
        boolean allMatchFlag = list.stream().allMatch(element -> element.length() > 1);
        boolean noneMatchFlag = list.stream().noneMatch(element -> element.endsWith("沉"));
        System.out.println(anyMatchFlag);
        System.out.println(allMatchFlag);
        System.out.println(noneMatchFlag);
    }
}
