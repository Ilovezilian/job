package my.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Created by Ilovezilian on 2017/6/22.
 */
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Circle extends Shape {
    int x;
    int y;
    int radius;

    public void prtCircle() {
        System.out.println("(" + x + "," + y + ")");
    }

    public void prtCircle(int i) {
        System.out.println(i + ": (" + x + "," + y + ")");
    }

    public Circle clone() {
        //        return new Circle(this.x, this.y, this.radius);
        return new Circle();
    }

    @Override
    public void draw(Canvas c) {
        System.out.println(this);

    }

}
