package my.collection;

import org.apache.commons.compress.utils.Lists;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @ClassName CollectionRetain
 * @Description 验证函数retainAll, 保留当前集合中所有存在于指定集合中存在的对象
 * @Author shuai.pan
 * @Date 2022-11-18 10:19
 * @Version 1.0
 */
public class CollectionRetain {

    /**
     * aList = [1, 2, 3, 4, 4, 3, 2]
     * bList = [3, 4, 5, 6, 3]
     * b = true
     * aList = [3, 4, 4, 3]
     * bList = [3, 4, 5, 6, 3]
     *
     * @Author shuai.pan
     * @Date 10:43
     * @Param
     * @param args
     * @Return void
     */
    public static void main(String[] args) {
        List<Integer> aList = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 4, 3, 2));
        List<Integer> bList = new ArrayList<>(Arrays.asList(3, 4, 5, 6, 3));
        System.out.println("aList = " + aList);
        System.out.println("bList = " + bList);
        boolean b = aList.retainAll(bList);
        System.out.println("b = " + b);
        System.out.println("aList = " + aList);
        System.out.println("bList = " + bList);
    }
}
