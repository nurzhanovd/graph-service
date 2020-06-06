import { createWriteSession } from 'core/neo4jSession';
const content = [
  'What is Computer Science?\n' +
  '---------------\n' +
  '\n' +
  'Computer science is the study of processes that interact with data and that can be represented as data in the form of programs.\n' +
  'It enables the use of algorithms to manipulate, store, and communicate digital information.\n' +
  'A computer scientist studies the theory of computation and the design of software systems.\n' +
  'Its fields can be divided into theoretical and practical disciplines. Computational complexity theory is highly abstract, while computer graphics emphasizes real-world applications.\n' +
  'Programming language theory considers approaches to the description of computational processes, while software engineering involves the use of programming languages and complex systems. Human–computer interaction considers the challenges in making computers useful, usable, and accessible.',
  'Data structures and algorithms\n' +
  '----------------------\n' +
  '\n' +
  '** Data structures and algorithms ** are the studies of commonly used computational methods and their computational efficiency.\n' +
  '\n' +
  'In mathematics and computer science, an algorithm (/ˈælɡərɪðəm/ ) is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of problems or to perform a computation.\n' +
  'Algorithms are always unambiguous and are used as specifications for performing calculations, data processing, automated reasoning, and other tasks.' +
  '\n' +
  '![](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEhMQEBIVFRUVFxgWFxUVGB4YFhcZFRcfGBYXGBgZHSkgGxolHRgYITEiJSkrLjAuGB8zODMtNygtLisBCgoKDg0OGxAQGzAmICUtKy0tLTAtKy0tLS8tLS4tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLy0tLS0tLf/AABEIAJsBRAMBEQACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAABAMFAQIGB//EAE0QAAIAAwQECAkJBgUDBQAAAAECAAMRBBIhMQUTQVEGFCIyU2FxkjNScnORsbLR0gdCgZOhs8HC0yM0VGKi8BaCg+HiNUN0FSQllPH/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAQIDBAUGB//EAD8RAAIBAgMDCQcDAwIGAwAAAAABAgMRBBIhMUFRBRMyYXGBscHRFDNSkaHh8CI0ciNC8QYVNVNiorLCFiRD/9oADAMBAAIRAxEAPwD3GAFplpa+UVK0AJNac6tPZMWUVa7ZdRVrtmNdM6Md8e6Fo8Rljx+hnXTOjHfHuhaPEZY8foY10zox3x7oWjxGWPH6BrpnRjvj3RNo8Rljx+hnXTOjHfHuiLR4jLHj9DGumdGO+PdC0eIyx4/QNdM6Md8e6Fo8Rljx+hmVaWLXGS6SCwxrkQD6xBx0ug4q10xmKlCltHCOVLNJjykNWAEycqMQrlL107KqYk2jQlLYm+xEJ4WWfp7N/wDZlxBdYSq/7X8mWotE04iUO+PdAwsuIa+b0Q7490BaPENdN6Id8e6AtHiGum9EO+PdAWjxDXzeiHfHugLR4hr5vRDvj3QFo8TeyWgvfBW6Ua6RWvzQ2B7GEBKNja0T7lOSWLGgApnQnaQMgYlK5Rs04w/Qv6U+KFlxF2HGH6F/SnxRNlxFw4w/Qv6U+KFlxFw4w/Qv6U+KIsuIuay7YzAMspyCAQapkcR86Jt1i5txh+hf0p8ULLiLhxh+hf0p8ULLiLmr2tlxaU4FQK1XCppsbriLdYuNxBIm1uN5lWVMe4QCVuAVKhvnODkw2QLZdLthxx/4eb6Zf6kBlXFfX0Djj/w830y/1IDKuK+voYNtcZyJnplfqQJyrj4+hnjj/wAPN9Mr9SBGVcV9fQOOP/DzfTL/AFIDKuK+voHHH/h5vpl/qQGVcV9fQOOP/DzfTL/UgMq4r6+hJZbVfLKUZCtKhruTVoRdYjYYBxsMQKhABACieGmeRL9bxZ9Fd5d9Bd/kMRUoEAEAEAEAEAEALt4ZPNv7SRb+19qLroPtXmNxUoc/Zp7SzMZELm+q0FcA9rmqzYA4KCW/ywNamxfm5Hj3yiD/AORtXlD2Fjph0T7Tkn9nDv8AFnt9i0qjXEuzQWoAWlTFWoWvOK02Rz2Pi5Umru6+aLKIMggAgAgAgBOw8+f5wfdS4F5bI9nmze2c6V5f5GiVvM3uGYgkIArNL6dkWQqJ7EX6kUUtlSuQ6xGlOlKp0TOdSMNpXPw2sdCQ7EjIFGFTsFaYRr7JV4FPaKdtopYOF9mVZQd2W7Lo6XCaEUAxu9uR9MTLC1L6IhYiFtS10dwpstomLKlOxdq0BRhkCTiRuEZzw84K7ReNaEnZF1GJqLaQ5n+ZPbESiHsGYgkTsPPn+dH3MuBeWxdnmxyBQgtdqSUt5zTYABUsTkqgYk9QgWjBydkeL8MeMm0TDaw4BYlA3MCE8kLSq5UrTbWOmNraH3vJPsqoRVFq9teN9/WdF8nFptEq+80TOK05zA3VauDCuIWlakYDAnaYpUseTy9HDzyqnbnOrh19fDeemKwIqMRGJ8sZgAgBSR4ab5Mv80SXfRXeNxBQIAIAUTwszyJfreLPorvLvoLv8jkOGPCS0Wa0auSyhdWrYqCaksDj9Aj1MDg6Vanmntue9yVybQxNFzqXve23qR1+jppeVLds2RWPaVBMeZUSU2lxZ4VaKjUlFbm/ElmTVXnMBXeQPXFUm9hRRb2I2VgRUEEbxiIgNW0ZmBAQAQAu3hk82/tJFv7X2ouug+1eY3FShSWbRgmVmCbNQ3pinVtQELOmEVFDjyjA2lO2llu8EVlt+Tyxz3abN1zu2LMZhqcKbBuEWU2tEdVLlTEU4KEHZLqOktC01Q3OB6FMVOGO8agVCACACACAE7Dz5/nB91LgXlsj2ebN7ZzpXl/kaJW8ze4ZiCQgDleG2g2tWqZXClbyhSCSxahAHdNTsGOyOnD1lTvdHPXpOdrFOnyfzR/3pZxBoVNMNhxjd42L3GXsr4k1r4Dz5rtMefLvMBWikDCgrSvVFYYuMUkkS8NJu7ZJwW4JvJnS7QZqm5eDIAag3SpFeomIrYlTi42JpUHGWa53EcR1i2kOZ/mT2xEoh7BmIJE7Dz5/nR9zLgXlsXZ5s0tWkQG1coCZNIrdBwUeM7fNX7TsBibFo0nbNLRcfTibWSw0bWzGvzKUvUoFBzVF+aPtOFSYXInUussdF+bRwqIgzCkAVrSHs5vSRel5tJGa72lfimW6hwM7TbMqmktvH19fmOSbYjqJisLp25doNciMiDiIWM3CSeVrUmBriIgqKyPDTfJl/miSz6K7xuIKhABACieFmeRL9bxZ9Fd5d9Bd/kedfKL+9/6Se08e9yX7nvfkfW8gftn/ACfgjrJfCOzWaXIlznKtqZbUCs2BWgxA6jHl+yVaspSgtLvejwf9vxGInOdON1ma2pb+soPlJmLMFkdcQyzGGGw3CM47uSk450+rzPV5Ai4OrF7VbzMnS02yaOsjSCAWZ1NQDhec7eyI5iFbFVFP82FfZKeJ5QqxqblfwOk4H6RmWmzibNILX2FQKYDLARwYyjGlVyx2aHlcp4aGHxDhT2WQlw+0jNs8qU0mYULTKEimIuk0xB3RrydRhVqNTV9PM6ORsNSr1ZRqK6S81wGeBFtmT7NfnOXa+wqaZClBgIpjqcadbLFWVkZcrUKdHEZKasrIt28Mnm39pI5f7X2o89dB9q8xuKlBPRXMPnJv3rQL1NvcvAcgUFbawGrJNOWM/JMC8Ve/YVmkdJG+4l2iXLWWq36y9abzVIFAwIwFdtawLKKirzT17jheFPDq3WO0zLOrSXCXeUZRUm8gbK/hnGsaaaue9geSaGJoqo21e+/7HpOibbrZMl2Zbzy0Ygb2UE0EZHgVYZZtbk2PQMwgBOw8+f5wfdS4F5bI9nmze2c6V5f5GiVvM3uKedwzsiMyM7VUlTyGzU0OzeI2WFqNXSMniIJ2Mf40seNGfAVNJbYDecIn2Wp+NEe0QEbDwws3hJ7HWHABVYqq1yGGZpU/RsAizwtTYkVWIhtZ0eidKyrUhmSSSoa7iCMQAcj2iMJ05QdpG0JqauhLSXCizWeYZU1mDChICk5ioxEXhQnNXiis60IuzKtOF9nE6qMdW68oXGvawYAgU2rh/lEX9lqW1X1Rn7RHNoN/42sfjv3G90R7LV4FvaKZNI0/ItassliSplk1UjAzANsVnRnT6RaNWM9hexianEcOJVpaTOFmvka8a0JW+U1CbsSK0qB740ha+p7XI8sPGunXts0vsvc820fZp5mAWdJmsBwuAhges7PpjZ23n2GIq4fm/wCq1l67fT7HvNhDiWmtoXurfIyvU5VOqtY5Wfm9TLneTZd27CeBUIADAHi/Dix2gWqc05GKs5KMAbhXJaUwvUAB24R0Qasfd8j1sN7NFQazJa6639OG4vfkus9qWY5o62e6ahqhS9RduA7aVqRFajVjzv8AUM8NKKUbOd93DrsegSPDTfJl/mjI+YfRXeNxBQIAIAUTwszyJfreLPorvLvoLv8AI86+UX97/wBJPaePe5L9z3vyPreQP2z/AJPwQpwu58j/AMWT+aNMD0ZfyZtyT0J/zl5Fjw38DYPMn2ZcYcn+8q9vqcnI3va/8vNkGmP+mWLzj+t4tQ/d1Oz0NML/AMSrdi/9Tqfk8/cx5x/XHn8pe/fYjx+XP3b7F4CXym+Bk+dPsNGvJXvJdnmjf/T/AL+f8fNDfyd/un+o/wCEZcp+/wC5GPLn7t9iL9vDJ5t/aSOL+19qPKXQfavMbipQT0VzD5yb960C9Tb3LwHIFCOfIWYLrqGG5gCMOowJUmndMobdocI76izqVmhL9xll4oTSoIIIocss98Tc2dR1I2nJ6d5w/CfgJbrXaXny5ctFYIArTKkBEVMTT+WNIVElY93Acq0MNQVOV21fd9zvbNomXJkSAZUsTE1CllUVvBlDUYCu/GM7nhzrSnOWrs7l7EHOEAJ2Hnz/ADg+6lwLy2R7PNm9r50ry/yNEreZs4jSHAWY0x5muQX5hIF04X2J39cd0MYlFKxySwrbvcms3AidLDhZ8vlpcNUJwIoaY5xWWKjK11s6yVh5K+orP4ATFUtr05IJ5p2VO+LrGrgVeFfE6vgtoZrHKaUzhyXLVApmAKY9kclarzks1jopU8kbFHwl4KPabTrBNVb4AAKk0uKBvjejiVThaxlVoOcr3F7PwDmoQwnyzQMKFWoQwKkYMDkTkYtLGRkrOJVYaS3kZ+T2af8AvpnXmn3xb21fCQ8K+JYcH+DjWQTXaYrXii0AIpdmjHExjWrqpZWNKVLJfU7GOU6ROw8+f50fcy4F5bF2ebItH+HtPlS/ulidxpU93Dv8SxiDAIAIAIAIAIAUk+Gm+TL/ADRJZ9Fd43EFQgAgBRPCzPIl+t4s+iu8u+gu/wAjzr5Rf3v/AEk9po97kv3Pe/I+t5A/bP8Ak/BCnC7wkj/xZP5o0wPQl/Jm3JPQn/OXkWPDfwNg8yfZlxhyf7yr2+pycje9r/y82QaY/wCmWLzj+t4tQ/d1Oz0NML/xKt2LyJ7DpmbZNHynk3atPdTeFRSld43RWph4VsVJT3JGdfBU8Vj5xqXsop6dxFp/Scy1WGRNm3b2vZeSKCgQ0wqYnDUY0sTKMdmXzRbA4aGHx06cNmVbe1HS/J3+6f6j/hHByn7/ALkeVy5+7fYi/bwyebf2kji/tfajyl0H2rzG4qUE9Fcw+cm/etAvU29y8ByBQIAIAIAV0jzV85K+8WJRaO35kdv0g0plRZMyaWDGksoKBSASdY6+MMqxBMIKW12+fkmc5pb5Q5FlmGTaLPaEcAG7SWcDliswiLKLew78PyXWrwz02mu/0L3g/bFno89AQswo4DZgPIlkVptxiGcdaDg8j2q6+rG7ZzpXl/kaC3mD3GLbZjMpRitCMjmK+uCdg1cZUUwiCSt4STAlnmzCt64tQMovTjmmkUqO0Wzj5HD91AUWdaeWfhjteCXxfQ5VinwMT+Gc4mTP1ShauLoet7IGvJwpELCR1jf6B4iWjsbn5RJn8OvfPwxPsK+L6D2t8DurLNMyWj5F1DYbLwrt7Y4GrOx2J3VxNpLqjX2ry1pgBnMBr9sToVs7FnFS4nYufP8AOj7mXAvLYuzzZDo4/t7V5SfdLEvYaVPdw7H4llEGAQAQAQBgmmcAZBgBSR4ab5Mv80SWfRXeNxBUIAIAUTwszyJfreLPorvLvoLv8ij4Q8Eltk3XGaU5ISgUHIk1rXrjsw2OdCGVRvrc9LA8qywtNwUU9b7SLS3AxbQ0tjOK3JSSsFBrcrjn1xajyhKkmsu1t/MvheWJYeMkop3be3iNaX4LJaUkI0x11KXAVA5WCipr5P2xnRxsqUpNJamOF5Tnh5zlGKeZ31v1+prauCcuZZ5NmMxwJRLBgBU3q54U+dEwx041ZVEldk0+VakK866iry3a23ehFM4Gy2s6WbWvdR2mBqCpLClDhSmMWWPmqrqWWqsXjyxVVd1squ1a2tiROCEnULZ3Z2VXMwGoBqwpsGUVeOqc46ism1Yo+Vq3PutFJNqxa6H0XLssvVSr12pblGpqc8fojnrVpVZZpbTkxOJniKnOT2kreGTzb+0kU/tfaZLoPtXmNxUoJ6K5h85O+9aBept7l4DkCgQAQAQBBa7MJi3SWGINVNCCpDCh7RAtGWV3OW05o5UZhMtDUnLgZtWCGW8s1W6MHNM+obqxLZs26kLKK04HnPDuztMtK6lWmKsmUl5Ea6Si0NMI2pSSWp9NyPVhSw+Wcknd7Wj1XgKpFklggghJIIOBB4tKwIjGW0+bxrTrSa4v/wAmXFs50ry/yNBbzke4ZiCQgCC3WRZ0tpT1uuKGhoadsTGTi7oiUVJWZzC8E7DrLlHrTK82dfdSOn2qrY5+Yp3G/wDBVkoFpMoDUDWGgO8CK+1VL38i3s8BK08ErGrqtybyq5MTXsiyxVXiVeHpnWSJQRVRclAUdgFBHM3d3OhKxFpDmf5k9sQQlsGYgk4jhxxnUz+LX6a8a3V1v3NQmVMaVpWnqrGkLX1Pa5H9n59c/bZpfZe55po4TtYOLazW1w1db9eun44b42dt59jiHh+b/rWy9drd32PcbI1quJfWVeui9y2HKpjkm+OZ2Pzqao5nlbtfTT7kt60eLK77fBDQranxYXp/iyu83ww0H6OsKz90r0t7oaD+n1nkXDsWrjMzjV67X9nnqrvzbuyu/bWN4Wtofb8jezcxHmrZt+zNf87i9+S0WnWNz+L3Tzq3L1RduV20rWnuitSx53+oXhsqy25y+7h1noMjw03yZf5oyPl30V3jcQVCACAFZlmYuXVytQARQEcmtMx/MYspaWaLqStZoOLzOlPdX3QuuAvHgY1EzpT3V90LrgRmjwM8XmdKe6vuhdcCbx4BxeZ0p7q+6F1wF48A1EzpT3V90LrgM0eAcXmdKe6vuhdcBePAOLzOlPdX3QuuAvHgZlWYhr7OWIBUYADEgnIdQg5aWDlpZIZipQRl2J1qFnMAWZqXVNL7FjjTeTEl3JPajbi0zpm7q+6IIzR4BxaZ0zd1fdAXXAOLTOnbur7okXjwDi0zp27q+6AvHgHF5nTt3V90BmjwDi0zp27q+6AzLgHFpvTt3V90BmXAkslnKXqsWLNeJIA+aFyHUoiBKVza0yS10g0Km8KioyIxFRsJ2wTsUaNLk3x0+rPxxOg1C5N8dPqz8cNBqFyb46fVn44aDU04vMrevpWlK6s5d+F0RZm9yb46fVn44aE6mDKmmnLl4Zfsz8cNBZmbk3x0+rPxw0GprMs8xhRnWlQTRCDgQc753boXRFmNxBYS4tMVnZHQB2DUZCxBCquYcYckbIF8yaSa/PkZEqf0kr6pv1YEXjwfz+xnVz+klfVN+rAm8eD+f2MXJ/SSvqm/VgRePB/P7GdXP6SV9U36sCbx4P5/YNXP6SV9U36sBePB/P7GDKn9JK+qb9WBF48H8/sGrn9JK+qb9WAvHg/n9jey2dlZndgxa6OSpUALWmBY44nbANp6IZgVCACACAMNAHO2UsovS1et1QWKOGALLevITR5lKmq1yOGQjolZ7fL8sds7N2k+O9cNz3LtJzaZxMsXnAZ2W9qsSl2qu3JIU3qDGgxy3Vyx1fnvKKELN2Wzjvvs69P8jEq+s8h3cgqtAF5FRevYgcnZmdu2KuzhojN5XT0Svrv1IVtL6o3S4YTQtTKNSrTKE3boqLpJqN0Wyxza8OPUXyRz62ta+3fb13EU23TiooSOYCbovcqYUJZWoVF0VGGJrnlEqEL69fgWjSp3169/VfSxfiMDkCACACAKrTd0NZyyswE0k3UZ6DVPQkIDheu/TSJRtSvaSXDq4owLZenyqCZceUxoZTAKbylatd5JIvVBPzRhvW0IyfofFNb/AM6itmWyc0qeriY5uMyfsnU1WayoBRcTQIfprSkTobqEFOLWmvFPci60ROZ0JmXr15gQy3QCDktQLybm2xDOeokpWWz8/LEJYC1iitjKIJutdJDArVqXa0rthuJ//Lv6hZbXM1U67fvLMwYymVippiBq8doqFOUTYtkjmV+HH7+Zo82cVkTC85QHYOFSpYXWCkrcqRWg5ozrQZw0JtBOUbLq1+/mX4MVOczABABACWmKapsCThS6CxrXCgUVi0dpWWwxOn/tZVL1GB+YSBUYEmnJOzExC2MN6oWkzZzF1JYclqELQAg4UvIPW3bvtorMhN6jmjGJlreLkgAEut01pjhQemKvaWjsG4gkIAq9NT5iXdWWpjW6pJrhTJHwz2DtiUb0YxlfN+fVC4ts7WMBeahXkXMKGWGblg0DAnAEnM54UmysW5uGRN9et+sil220XGqWrflUbVNWjuBMBFwVCiprT6YmyLOFPMux71uWm/eE3SM4CWwv8xyw1LEsUmKq15NRVSxp1VFIWQjShqtNq3ren9hx7Qwmzl5fglKnVnAi9UK12jfNNMcSeyIsZKCyRfXrr2fLeKSLdPKgGt6+oJMu6xDSb5uK9ASHqNpABriKwsjWVOmn3PfffbVrqLTRE1nkSnc1ZkVjgBiwqcB2xD2mFaKjUko7ExNGdHnhpk2hN5KJeCrcXFSENSGvC7jvptiTR5XGFkuvXrfWLG1WkSpTgs18Av8AsyrIbuIC3SQC2GKnbjiCFkaZKWeS4bNb377rd1mRbLXflhkArq60VrprTW1wNKY0qy9dYmyI5ujZu/Hh3fPsZ0EUOQIAIARFpms0xURKIwWrOQTyFbIIfG37InQvlikrm9+f4krvt8ENCP0mL8/xJXfb4IaD9JRW/hnIkOZU2bIDg0IDTGodxKyiAe2NY4ecldI7KXJ9arHPCLt3epcWS2TJqCZKEl1YVDLMJB+kJGbjZ2ZyygoPLK6fYS35/iSu+3wRGhW0SOZJmMQzSZJK5EsSR2HV4RKdtEyykkrJv87yS/P8SV32+CI0K/pM2W0OXeW6qCqq3JYsCHLDao8T7YNBpWuhuIKkKzGOSilSMWOw08XqjFTnLYlv3/YtZIzefxV7x+GJvV4L5v0Fl+f5NXmMASQoAxPKPwxWU5xTlJKy636BJPRfn1E7JpUTWuqBXZUkV7OTHn4XlaniZunDb1t69mhvUw0qcc0h68/ir3j8MelerwXzfoYWj+f5C8/ir3j8ML1eC+b9BaP5/kKv4q94/DC9Xgvm/QWj+f5Cr+KvePwwvV4L5v0Fo/n+TMlya1FCDTA12A7uuJpycrprZ6XIasE6ZdGArUgbs4tJ2INFmuSRdGH83VXdEZpcCASa5yUZkc7caboKUnuFzN9/FHe/4wvLgLsL7+KO9/xheXAahffxR3v+MLy4DUL7+KO9/wAYXlwGoX38Ud7/AIwvLgLsw01hiVFKgYNvNN3XBya2oXJ4uSQJIRWZ1RQzUvMAAWoMKnbGfOO7SWws5NpJvREteqGaXw+BUK9UM0vh8AFeqGaXw+BJFaJKzBddAw3MAR6DE55fD4Exk4u6ZuuAoFoBsEM0vh8CDNTuiM0vh8CLGa9UM0vh8BYAYmM7tpoG0XAQAQAnYefP84PuZcS9xaWxdnmxyIKmrioIy64A8GtfAy2iY6pKacA5XWJirEZmpO/A1yII2R7McTTyq7sfa0uVMM4Jyll02HpXAHR8zR8jUWrkmY99cbyKWAGrJyDYV3GuBJjz8TNVJ3ifO8pV4Ymtnp7Erfc7GOY8wIAIATk+Hmeble1NidxZ9Fd/kORBUis+R8pvaMZUuj3vxZaW35EsalRXSa1lutcSKDrOwRx8oQz4acFtasu3ga0XaomzntG2VxMUkFLp5xGRyA+k4R8hyZgq8cTGUk4pPa1+bT08TWg6bSd7nRpPpg+B2H5p9x6j9sfaRquLy1NHx3P84P6nk5b6oYjcqEAEARSc38r8qxlT6Uu3yRZ7EYtHzfKX1xae7tKMzK5z9o9kRK2sBZ8j5Te0YRJJYsCFyxaikCgBxFcyesboo817IgLszxl7h+KFp8fp9xqF2Z4y9w/FC0+P0+41NWLrQllIqBS6RmaZ3uuIeZb/AKfcam1pyHlJ7YiZ7Pl4hk0XJOX4e39Qty9XWrza1pcbdsjlqXtK3HyR6nJPN8//AFLWs9trfU4JhPw8N/VuMc39Tr+p9K3hP+j/ALSS06yq6vX0oK1vVrTH7YrHnd9/qZUuYt/UyXu/h2biNhPw8Nn/ADRb+p1mreE/6P8AtLTgyJ3GpN7W0vY1vUyOdY0o586vc4+UXhvZp5Mt9Nlr7UemTbQqEA1x3An1COqrXp0rZ3Y+TSbK2bwmsiEq04Ag0IKtUEYUygq9Nq6Z0wwWInFSjB2Zr/iqx9OPQ3uiedhxLf7fifgfyLKyz1mATENVYAg7wduMRF3m2uC8zllFxeWW1E8alQgAgBOw8+f5wfcy4l7i0ti7PNlDwz4aS9HFZYQzJrC9drdAWtKsaHOhoKbDlG9DDurruPQwHJs8Xd3slvKnQHD3j8xbKyahnry1a9UAVKrgLrkDA7MdtI0q4V01mvc6MXyS8NDnU8yXVb8R3kmUqKEUAKBQAZADZHI3c8Ztt3ZmbKVwVYAgihBFQRuIiAm1qjndOaeXRaqZxaYjVEtQazQQK0JJ5SfzE1GFa1rG1Ok6rsjsw2Eni5NQ0a28Cu0D8o9ntM1ZLy3lFzdUsQVJOABIyJ7I0qYScFm2nTieR61GDndNLbY7aOU8kTk+Hmeble1NidxZ9Fd/kORBUis+R8pvaMZUui+1+LLS2/I2mzAoqf8Ac9Q64tOagrshK5HKlkm8+eweL/v1xnCDbzz27lw+/Fkt7kSuoIIORjWUVJWewqnYgl9G+O6uN4dfWIwj/wAqevDrXqvuWfxILjJzeUvinMdhOfYYZZ0ujquG9dnoxdPaTSpoYVH+46iNhjaFSM1eJDTW03i5BFJzfyvyrGUOlLt8kWexfm8xaPm+Uvri093aUZoL157pXMZg+KOuI/Vd2GpvZa3cc7zZeUYmGzUImi5JEvPPkr62iv8AcRvNEmTCAQq0OPOO3/LFU5PXQamBPYOqMo5QJBBrlTOoG+GdqST3i+tiPSdrWWFvECrLnuBBJ+iKV6saaV3vIlJLaT2g8keUntiNJ7Pl4ksmi5Jqu3+9kZw2y7fJEm0aEC9h5g7W9oxCLS2jESVCAEbcDeWhA5JzFdo648PlnZDv8jSmeU6dB4xOxHhW2fzdsTQ93HsPtMF+2hruEqGuYy3f7xodWt9p63wX/dbP5pPVHoUtvcvM+Hxv7if8n4ltG5yhABACdh58/wA4PuZcS9xaWxdnmzl+G3BeXpCYgRis5RRnAqqy6ki+N9a3QDXE7MuihXdJdR6XJ/KE8KndXi93X1eYlwe4DLo6atqmuZxSvNWgl1FL93EvgTllXI7L1cU6qypWNcXyrLFQ5tLKvHq6jv5cwMAykEEVBBqCDkQd0cZ4zVtptAHIcO+D66Q1UpGpOSrA5qqNnf3AlQBtqDhQGnTh6zpXe49Lk7GvCtyavF/mhzWh/k6m2abLn2lldJbhismrNyTUGhAqKgVAqaZRvUxanHLFHo4nlmNWm6dNWbVrs9RkzVdQykMpFQQagjqMeefONW0YtJ8PM83K9qbE7iz6K7/IciCpRaQ0o0o3EArViScc3OEfNco8rVMLJU6SV9W79rO/D4VVFmkN2C1LMAmOwBxFK4LvpXfvj0MDi4Yimq02k+F9n+eJz1qTpycEO8YTx19Ij0Ofp/EvmjLLLgHGE8dfSIc/T+JfNDLLgRWmahFb64YggioI3RlWq0nBvMtNdq3ExjK+wqbLpt2mAMBdJAwzFco+dwvL1WpiFGaWVu3WjvqYKMYNp6oupskHlA0O8eo7xH006Sl+paPj+bTzlKxRnTrh8Qt0GhpmRvj5d/6gqqvZpZU7fc9L2GLhe+peSM38r8qx9TTd3Lt8kec9i/N5i1tQAnxl9cWm7IoyGRMLl2RgBepipzAAO0RSLzNuLITvsNrPaAAQSSbzVop8YxMJpLUlMl40vX3T7otzkRcxKcMxIrkMwRtO+Cd3oDay8xfJHqiYdFBbDmdLK5takVzS6dgyrj9P2x5GJU/aU11WOeafOD3CPR0yaUaWK0qCK0pXbjHRjsPOq04FqsHK1iyEq5KRDjd1Yr2MojrUctNLhbyNbWVhuNixqm3t/CM4bZdvkiTaNCBKzWgKt0h6gn5jn5x2hYi5o4tu6t80S8cXDBhUgYowFSaDErTOFyHB/jQxElBDSC1ZeSDgc+0R4fLOyHf5GlM8p04v/uJ3JHhW9qJoe7j2H2mCX/1oabhK7jzRlGh1b9h65wW/dbP5pPVHoUtvcvM+Hxvv5/yfiW0bnKEAEAcNwx4WNo8zFlIGmTZhILc1QsqWKkDM1OA/s9WHoc7t2I9bk7k9Yp3k7JfPayj4F8PphnS7PPRCs1gusUEPfc0DPUm9U0GynYKRvXwiUXKO47sfyPCFN1Kbem58Oo9Tc0BNK9UecfNngNs4VWxpjMJ0yTyi2rlkoqEnEXR151213x7UcPTtsufcUeTsMoJZVLTa9bnUz+FtubRQnVIfXappwGJS7UNgKAluTe6t5jmVCmq2Xq2Hlx5Pwyx3N7rXt18PM5XQXCK2Sp6tKmzJjMwqjMWEw4ChBriRhXMR01aNNx1Vj1MVgsNKk80Uklttax7tpWe8uRNmSlvOqMyr4zBSVHpjx4pOSTPi6UYynGMnZNq54A/CC1lzM4xNDFrxusVFTmbq0H2R7So07WsfcrBYdQy5Fb5/U9i4CW+daJSzrRz2lS6mlLwEyaFenWAD9seVXjGM2o7D5DH0oUqrhT2J+S0OojA4Slt2ijNN9SAasDXI8o0j57H8kPFyVSErPVO/aztoYrmlZr8sNWOSJKhGAI2Psqdh3R3YTDxwlNUpK6+LrfHgY1ajqycvoPXBuHoj0ObhwRjdhcG4eiHNx4IXZFaboFLoJOAG+sZVowUbWWuluJMW77SpsugirhmYFQagbTTKseDhuQHSrqpKV0nc7amNzQypals8/G6ovNu2DtOz1x7862uWKu/Dtf4ziUd7Kj/0El6lhdrUgDHsHvj57/483WzuSy3vbyO7279FralxIzfyvyrH0dPpS7fJHC9i/N4Wn5vlL64tPd2lGaCWSz0criMBTxRvBiuVtvUGlnnUBBvmjNjdOPKO4UhGVlbXfuITJeMjc/cb3RbnFwfyZNw4yu5+43uhnXX8mLids0iLPLlllJJAAXI4DGtYwrYhUIJtFJTUENWS68sHMOKnrvZxrTanBNbGXTuriw0qiTBIcm9WldmPNr1kUjL2mEZqk9pXOk8o5ash5Se2I3ns+XiWZNFyTVNvb+EZw2y7fJEm0aEBAENqllloKVqpxy5LBvwiGTF2ZrWbuT0n3Q1Lfo6yut5m3sQuy7QvlVb96gzzp9EeLyv/AGX6zSnk6zzPTlNfO53hW3+NCh7uPYfY4K3s0OwSwrty641OrS565wX/AHWz+aT1R30vJeZ8Pjffz/k/Eto3OUIAIA5rS3BuRb9ck8GqzeS6mjLWTLrSoIoaDAjZG1OtKnrE7cPjKuGalT4arc9WLaA+T+y2OYJ4Z5jrit8iineAAMe2L1cVOorM2xXK1fEQyOyXVvOgt1pbCVKprHyOYRdsxuobBtNBlUjBLezz4RW2Wz80ELRwQsUzGZIVm2uah2JzZiCKsc6mLqvUWxnRDHYiGkZtLhuJpCLJUWaaqmUeQjXQEYbEdQKBvoo2yhwirbbzIybcnni9d/HtJrDoKyyGvybPKRvGVAD9BphCVSclZsmpia1RWnJtdpYxQwKydwesjvrWs0kvWpYopJO84YmLqrNK12bxxVaMcqm7cLsmkCk+YB0Ur2psV3Gb6K7X5DsQUIrPkfKb2jGVLo978WWlt+RIwrgY0aTVmVF6GXlUruzK9m8dX/5HPaVHZrHhvXZxXVt4F9JdpqdIyq3b4r/f29UZ/wC44bPkzq/59eotzNS2a2hkNT9o+BOAG4bgNpPV+EXTUf6lTR7lw6u17yu3RGaM+dVXd849p2fRj2RNp1Nv6V9X6eJGiJ5csKKAUEbxhGKtFENt7TaLEEUnN/K/KsZU+lLt8kWexGLT83yl9cWnu7SjMtIBJNWFdxIg4XdxY2lywooOvPHM1iyViTeJAQBW6a0ZxgLRrpUmlcRQ5+oRyYrDc8lZ2aM6kMw5Y5AloqD5opX8Y3pwVOCitxeKsrFLa9Es9oM1SCoKkjbVQMB6B6Y4amEc6/OLZoZSp3ncuZzhlBGRZPbEd8neOnV4mrJ4uSapt7fwjOG2Xb5Ik2jQgIAIAIARt1by0IGBzFdo6xHh8tbId5pTPKNOk8YnYjwrbP5u2FD3cew+1wV/ZodglexzGX97Y1OrW565wW/dbP5pPVHoUtvcvM+Gxv7if8n4ltG5yhABACdh58/zg+5lxL3FpbF2ebPOvlftdpV5SKWWQVzUkBnqahiNwpQHrjvwUYO99p9ByFToyUm7OXl1FN8l1ptAtipKLGWQdaM1CgG6TuN7LtPXGuMjDJd7dx2cs06Ps95Wzbj2qPKPkTSdKV1KsAQRQg4gg7DAJtO6PDtL8M7brXRJ0yWiMyqmFVCsQAzEVYjKpJyj16eGp5U2j7LDcmYbm1KUbtraejfJvp+dbZDmfi0t7t8Cl6oriBheHVvEcOKpRpztE8DlXCU8NVSp7Gr24HXRzHmCcnw8zzcr2psTuLPorv8AIciCpFZ8j5Te0YypdF9r8WWltJY1KgYhg4rUvrLlDfvfbXP8Y/OOYre1c3b9d/Pae9zkOazbrHXypAGJNW3n8Nw7I/QoUVF5nq+PpwPDcr6E0bFQgAgCKTm/lflEZU+lLt8kWexfm8xaPm+Uvri093aUZNFyQgAgAgAgCk4SaQmSrglml6pJpXKmGPbHn46vOllUd5jVm42sWWjXvSkbayhj2nEn0x10ZZqalxRpF3SZztmt0w2koSbpmUK7BR61G7L7Y8unXqPEOL2X2d5gpyz2Orj2TpNV29v4RnDbLt8kSbRoQEAEAEAavLBzAPaIhpMGnFk8Re6IWRN2Y4qniL3RCwzM3RQDQCgoMBGa6b7F5g3jUgIAIAW4pRmZXdb5vEC6RUKF2qdiiJuWzGJtivgq0xmBzBVCD9BSFwpW1XmRS7GkleTM1a9Sy1H2JBu5Lk5vXX5kktb3Nnsey4fUsCHptXib8XbpX9CfBC5F1wKTSfAqyWl9ZOUlziWFFJ8q4BX6Y1hiJwVkzso8oYijHLCWn5xLSw6KWQglyWKIMlVUA6/mZ9cZym5O7OapVlUlmnqyfi7dK/oT4Ii5S64GZFmuszlmYsFBLUyWpAFAB84+mFw3fQniCCISaZMwxJ2bTU5iMuaa2Sf09C2bqDVHx2/p90Obl8T+noLrh4+pgpvmH+n3RDjbbN/T0F+rxDU7b59C/DDmne+Z/T0GbqM6o+O39PuiebfxP6eguuHj6mBLPjt/T7oZH8T+noLrh4+pnVHx2/p90ObfxP6eguuHj6hqj47f0+6HNv4n9PQXXDx9TaVLu1xJqa49lNnZFoQy31vchu4TZd4UqRiDUdXbFmrkGmpPSN/T8MVyvj4ehFg1J6Rv6fhhlfHw9AYVK5TWPZd+GCV9/gDOpPSN/T8MMr4+HoLGDLIxMxv6fhhlfHwBDatHLNAExmYA1HN/BYzqUI1FaWvyIcFLaTrIIwDsANlF+GNMnX4ehNiIWBb1+vKNKmigmhqKkLXYIrzMc2bf3EZVe43GpY1uxm6et7sGGoMzTZiYZOtkmFIORrTA47d0MnWwZI64c31sgMKVrhnXZDJ1sGbvXDm+tgLvXDm+tgLvWYc31sGQsTGFncGYuAgAgAgAgCK0opXlJfpiFoDiMqVwrAlPUoLPZXWVZQsubLbkrO1dwG6qEco1x5VKEY0rlFjpck5TbafC9+JKZVrE+gZjLDLdJukFAovBsRyi17GlcuyGhW9LJ1+f+CTQKWoE8YJ5orWlC/zipBOHVQDqEHbcRWdP+z8RdxUwCACACACACAErVKJJoK1u0JFQKfSKb44q9KUm7Lba3VY0i0gAflnlZ4A0pQjZ9sIqp+tq+3S/AXWhGXYBQxbFiNgJF0kZnfGTlUioqTfS6k2rPzJsndrgby1cMCQclDZUOBqfVF4Rqqom0/7b7LbHfyDcbW7R6O8yCACACACAI54qrClag4ZVwyrsistjAhxdiG5JHMxwVjdNSDdwPVlnGORtPuKWJJ2sqt0MAKbiTjyr2O7tziZZrqxLuazEcq4IckhxSq3TWt0Adn+8GpNO/WHcYsV6hv1rXbl9A2DZF6d7akoZjQkIAIAIAS0rKLqoUGt9DVaVUBgS3Kwyislc1pSUW2+DK2ZJnqGEu+DfZg1FqxoLpIBAu57NmUVs9xspU21m4Ljp4jRE3W1o5TdhSl3KlaHHqr1xbW5ksmTrF7NLmrIaXdmVEtAvNreu0IFDSgIEVV7Gk3B1FLTa77dlye2NNvIyCZQJUqLtL15aAgnOl6Jd9xSGSzUrbevg/sa2ac5n3S9QNZUAimDAICtKigJzzzx2Fe5MoxVO9uH3LiLnOEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAYpEWQMxICACACACACACACACACACACACACACACANBMFSKiozFcRAGxYQBrrF3j0wAGYozI9MAZqN4gAEwbx6d2fqMABmAZkYZ4wAXhvEAZBgDMAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAEAQGzJev3Re37f7wgDSZYZbGrICRgCcdlNvafTAGH0dKapMtTXDEdh/AeiANV0XIAoJSgdnaPxMAB0VINaylx6uzLdkMoAyNGyejX0f3vgDUaJkUA1a4f39OQ9AgDfiEoi6UUjcevE/31CAJ7PJWWoRFCqMgMAIA//9k=)',
  'Functional Programming\n' +
  '--------\n' +
  '**Functional programming** (often abbreviated FP) is the process of building software by composing pure functions, avoiding shared state, mutable data, and side-effects. \n' +
  '\n' +
  'Functional programming is declarative rather than imperative, and application state flows through pure functions.',
];

const fulfillQuery = `
  match (u:User { username: "daulet" }), (n:Node { uuid: $uuid })
  merge (u)-[:FULFILL]->(n)
`;

const isFulfilledQuery = `
  match (u:User { uuid: $userId })-[rel:FULFILL]-(n:Node { uuid: $nodeId })
  return rel
`;

const NodeToRootPathQuery = `
  match (n:Node {uuid: $nodeId})<-[rels:DEPENDS_ON*0..]-(p:Node)
  return p
`

const neighboursQuery = `
  MATCH (:Node { uuid: $nodeId })<-[:DEPENDS_ON]-(:Node)-[:DEPENDS_ON]->(nodes:Node) return distinct(nodes)
`

export const FulfillNode = driver => async (_, { uuid }) => {
  const session = createWriteSession(driver);
  await session.run(query, { uuid });
  session.close();
  return true;
}

export const IsNodeFulFilled = driver => async (_, { userId, nodeId }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run(isFulfilledQuery, { nodeId, userId });
  session.close();

  return Boolean(records.length);
}

export const NodeToRootPath = driver => async (_, { nodeId }) => {
  const session = createWriteSession(driver);
  const { records } = await session.run(NodeToRootPathQuery, { nodeId });
  session.close()
  return records.map(n => n.toObject().p.properties);
}

export const NodeNeighbours = driver => async (_, { nodeId }) => {
  const session = createWriteSession(driver);
  // еботня здесь смотри query выше
  const { records } = await session.run(neighboursQuery, { nodeId });
  session.close();
  // еботная идет в stdout
  return records.map(n => n.toObject()).map(n => n.nodes.properties);
}

