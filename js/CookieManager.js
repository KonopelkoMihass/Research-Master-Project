/*
 * Creates Cookies used to store the user's signin details
 */
class CookieManager
{
    constructor()
    {}

    getCookie(cookieName)
    {
        var neededCookie = cookieName;
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArrays = decodedCookie.split(';');

        for(var i = 0; i < cookieArrays.length; i++)
        {
            var cookie = cookieArrays[i];
            if (cookie === "")
            {
                continue
            }

            var checkedCookieName = cookie.split("=")[0];

            if (checkedCookieName === cookieName)
            {
                var stringifiedData = checkedCookieName = cookie.split("=")[1];
                return JSON.parse(stringifiedData);
            }
        }

        return {};
    }

    setCookie(cookieName, data)
    {
        var date = new Date();
        date.setTime(date.getTime() + (15*60*1000));

        var expires = "expires=" + date.toUTCString();
        var content = JSON.stringify(data);

        document.cookie = cookieName + "=" + content + ";" +  expires + ";path=/";
    }

    deleteCookie(cookieName)
    {
        var expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.document.cookie = cookieName + "=" + ";" + expires;
    }
}