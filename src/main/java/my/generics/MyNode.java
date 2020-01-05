package my.generics;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}
