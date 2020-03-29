package my.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rectangle extends Shape {
    private int x;
    private int y;
    private int width;
    private int height;

    @Override
    public void draw(Canvas c) {
        System.out.println(this);
    }
}
