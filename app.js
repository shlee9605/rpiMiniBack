// npm i
// npx sequelize init
// npx sequelize db:create

const express = require('express');

const path = require('path');

const cookieParser = require('cookie-parser');  //cookie
const passport = require('passport');           //passport
const morgan = require('morgan');               //morgan
const session = require('express-session');     //express session
const dotenv = require('dotenv');

const passportConfig = require('./passport');

const cors = require('cors');                   //cors
const corsConfig = require('./config/corsConfig');

const {sequelize} = require('./models');

const indexRouter = require('./routes')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')


// passportConfig(); // 패스포트 설정

dotenv.config();

const app = express();    
app.set('port', process.env.PORT);    //setting connect port

app.use(cors(corsConfig)); // cors설정

sequelize.sync({force: false})        //Sequelize DB
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });


app.use(morgan('dev'));     //morgan get time

app.use('/', express.static(path.join(__dirname, 'public')));   //static using public folder

app.use(express.json());                          //body parser  use req.body
app.use(express.urlencoded({extended: false}));   

app.use(cookieParser(process.env.COOKIE_SECRET))  //cookie parser use req.cookie

// app.use(session({     //express session use req.session
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie:{
//       httpOnly: true,
//       secure: false,
//     },
//     name: 'session-cookie',
//   }));

  // app.use(passport.initialize());   //using passport
  // app.use(passport.session());

  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/profile', profileRouter);

  app.use((req, res, next)=>{       //page not found error
    res.status(404).send('Not Found');
  });

  app.use((req, res, next)=>{       //else
    console.log('모든 요청에 다 실행됩니다.');
    next();
  });
  
  app.get('/', (req, res, next)=>{      //homepage
    // res.send('Hello, Express');
    console.log('GET / 요청에서만 실행됩니다.');
    next();
    // res.sendFile(path.join(__dirname, '/index.html'));
  }, (req, res)=>{
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
  });

  app.use((err, req, res, next)=>{      //500 error
    console.error(err);
    res.status(500).send(err.message);
  });
  
  app.listen(app.get('port'), () => {       //specify port
      console.log(app.get('port'), '번 포트에서 대기중');
  });