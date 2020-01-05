package my.corejava;

/**
 * Created by Ilovezilian on 2016/10/18.
 */
public class boss extends employee{
    int i = 1;
    private boss(){
    }
     boss(int i){
    }
    private boss(double i){
    }
    public int setI() {
        return this.i = i+2;
    }

    public int setI(int i) {
        return this.i = i+2;
    }

    public static void main(String[] args) {
        new boss();
    }
}

