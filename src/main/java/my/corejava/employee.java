package my.corejava;

/**
 * Created by Ilovezilian on 2016/10/18.
 */
public class employee {
    int i = 10;

    protected employee() {

    }

    public int setI() {
        if (1 > 3) {
            System.out.println("hahaha");
        }
        return this.i = i + 1;
    }

    public int seti(int i) {
        return this.i = i + 1;
    }
}

class test {

    public static void main(String[] args) {
        new employee();
    }
}
