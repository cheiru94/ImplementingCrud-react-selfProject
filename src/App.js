import { useState } from 'react';
import './App.css';

//修正: 
function Update(props) {
  const [title, setTitle] = useState(props.title)
  const [body, setBody] = useState(props.body)
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={e => {
        e.preventDefault()
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name='title' placeholder='title' value={title} onChange={(e) => {
          console.log(e.target.value)
          setTitle(e.target.value)

        }} /></p>
        <p><textarea name='body' placeholder='body' value={body} onChange={(e) => {
          setBody(e.target.value)
        }}></textarea></p>
        <p><input type="submit" value="修正" /></p>
      </form>
    </article>
  )
}



// ⭐ App ⭐
function App() {
  // const mode = 'WELCOME';
  const [mode, setMode] = useState('WELCOME')
  const [id, setId] = useState(null)
  const [nextid, setNextid] = useState(4)
  const mainTitle = `Ichiban's UKIYOE Museum`

  const [topics, setTopics] = useState([
    { id: 1, title: '葛飾北斎 展', body: '天才の絵師.....' },
    { id: 2, title: '歌川国芳 展', body: 'これぞ武者絵だぞ.....' },
    { id: 3, title: '歌川広重 展', body: '時代を超えた悲運の絵師.....' }
  ])

  let articleContent = null

  // 업데이트 컴포넌트 
  let updateContextControl = null

  //  ⚪⚪각각의 모드가 변경되면 해당 컴포넌트로 변경 시킨다⚪⚪

  if (mode === 'WELCOME') {
    articleContent = <Article title='Welcome' body='Hello UKIYOE'></Article>
  }
  else if (mode === 'READ') {
    let title, body = null; // 밑에서 사용하니 미리 공간 확보해 둠 
    for (let i = 0; i < topics.length; i++) {
      console.log(topics[i].id, id)
      if (topics[i].id === id) {
        title = topics[i].title
        body = topics[i].body
      }
    }
    // READ일 때만 ARTICLE, UPDATE 나타내기
    articleContent = <Article title={title} body={body} ></Article >
    updateContextControl =
      <>
        <a className='updateprop' href={"/update" + id} onClick={e => {
          e.preventDefault()
          setMode('UPDATE')
        }} > 修正</a>
        <input type="button" value="削除" onClick={(E) => {
          const newTopics = []
          for (let i = 0; i < topics.length; i++) {
            if (topics[i].id !== id) {
              // 같으면 어떻게 뺄래
              newTopics.push(topics[i])
            }
          }
          setTopics(newTopics)
        }} />
      </>
  }
  else if (mode === 'CREATE') {
    articleContent = <Create onCreate={($title, $body) => {
      const newTopics = [...topics]
      newTopics.push({ id: nextid, title: $title, body: $body })
      setTopics(newTopics)
      setMode('READ')
      setId(nextid)
      setNextid(nextid + 1)
    }}></Create >
  }
  else if (mode === 'UPDATE') {
    let title, body = null; // 밑에서 사용하니 미리 공간 확보해 둠 
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title
        body = topics[i].body
      }
    }
    articleContent = <Update title={title} body={body} onUpdate={(title, body) => {
      console.log(title)
      console.log(body)
      const newTopics = [...topics]
      const updateTopic = { id: id, title: title, body: body }
      for (let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopics)
      setMode('READ')
    }}></Update>
  }

  // ⭐⭐
  return (
    <div className="WELCOME">

      {/* 1.  HEADER */}
      <Hearder title={mainTitle} onChangeMode={(e) => {
        setMode('WELCOME') // 누면 WELCOME 컴포넌트 내용 실행
      }}>
      </Hearder>

      {/* 2. topics를 props로 넘기려고 속성 값 추가  */}
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ')  // 누면 READ 컴포넌트 내용 실행
        setId(_id)
      }}></Nav>

      {articleContent /* 3. Article 나오는 부분 - mode에 따라 안의 내용이 변경된다.  */}

      {/* 4. CREATE */}
      <a className='createprop' href="/create" onClick={(e) => {
        e.preventDefault();
        setMode('CREATE') // 누면 CREATE 컴포넌트 내용 실행
      }}>登録</a>

      {/* 5 UPDATE */}
      {updateContextControl}

    </div>
  );
}
export default App;


// 🟢 CONPONENT 🟢

// 🟢 1. HEADER
function Hearder(props) {
  // console.log(props) //  props로 들어오는 값이 무엇인지 확인해 보니 객체가 들어있다. 어떤객체❓ => 만들었던 컴포넌트 객체 
  return (
    <header>
      <h1><a href="/" onClick={(e) => {
        e.preventDefault()
        props.onChangeMode();  // WELCOME모드로 변경

      }}>{props.title}</a></h1>
    </header>
  )
}

// 🟢 2. Nav
function Nav(props) {
  // console.log(props)
  const lis = []
  for (let i = 0; i < props.topics.length; i++) {  // id가 가각 1 , 2 , 3 인 torpics를 만든다
    let t = props.topics[i]
    // 重要:1 , 2 , 3 쨰를 각각 생성
    lis.push(
      <li key={t.id}>
        <a id={t.id} href={'/read/' + t.id} onClick={(e) => { // Nav 클릭하면 
          e.preventDefault()
          // id:1 , id:2 , id:3  버튼 누르면 이 id들이 id state에 들어간다
          props.onChangeMode(Number(e.target.id)) //⭐ 현재 누른 a태그의 id를 onChangeMode로 전달
        }}>{t.title}
        </a>
      </li >) // key라는 고유한 값을 줘야 한다.
  }
  return (
    <nav><ol>{lis}</ol></nav>
  )
}

// 🟢 3. Article
function Article(props) {
  // console.log(props)
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  )
}

// 🟢 4. CREATE
function Create(props) {
  console.log(props)
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={e => {
        e.preventDefault()
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name='title' placeholder='title' /></p>
        <p><textarea name='body' placeholder='body'></textarea></p>
        <p><input type="submit" value="提出" /></p>
      </form>
    </article>
  )
}
