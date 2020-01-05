package my.generics;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class Node <T> {
    public T data;

    public Node(T data) { this.data = data; }

    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}
