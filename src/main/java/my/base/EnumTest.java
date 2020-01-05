package my.base;

/**
 * Created by Ilovezilian on 2017/7/9.
 */
public class EnumTest {
    public enum Day {
        SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY
    }

    Day day;
    public EnumTest(Day day){
        this.day = day;
    }
    public void tellItLikeItIs(){
        switch (day){
            case MONDAY:
                System.out.println("monday is bad day");
                break;

            case FRIDAY:
                System.out.println("friday are better");
                break;

            case SATURDAY:case SUNDAY:
                System.out.println("weekends are best");
                break;
            default:
                System.out.println("midweek days are so-so");
                break;
        }
    }

    public static void main(String[] args){
        EnumTest firstDay = new EnumTest(Day.MONDAY);
        firstDay.tellItLikeItIs();
        EnumTest thirdDay = new EnumTest(Day.WEDNESDAY);
        thirdDay.tellItLikeItIs();
        EnumTest fifthDay = new EnumTest(Day.FRIDAY);
        fifthDay.tellItLikeItIs();
        EnumTest sixthDay = new EnumTest(Day.SATURDAY);
        sixthDay.tellItLikeItIs();
        EnumTest seventhDay = new EnumTest(Day.SUNDAY);
        seventhDay.tellItLikeItIs();
    }
}
