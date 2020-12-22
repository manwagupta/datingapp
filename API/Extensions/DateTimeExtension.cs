using System;

namespace API.Extensions
{
    public static class DateTimeExtension
    {
        public static int CalculateAge(this DateTime DOB)
        {
            var today = DateTime.Today;
            var age = today.Year - DOB.Year;
            if(DOB.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}