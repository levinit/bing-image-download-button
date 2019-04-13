// ==UserScript==
// @namespace   https://greasyfork.org/en/users/131965-levinit
// @author      levinit
// @name        Bing Image Download Button
// @name:zh-CN  必应图片下载按钮
// @name:zh-TW  必應圖片下載按鈕
// @name:ko     그림 다운로드 버튼이 있어야 합니다
// @name:fr     Bouton de téléchargement des images de bing
// @name:ja     画像をダウンロードする必要があります
// @description Add an image download button on Bing's home page.
// @description:zh-CN  在必应首页添加一个图片下载按钮。
// @description:zh-TW  在必應首頁添加一个圖片下載按鈕。
// @description:ko    그림 다운로드 버튼 필드에 추가합니다.
// @description:fr    Ajoutez un bouton de téléchargement à la page d’accueil de bing.
// @description:ja    必ず画面に1つのダウンロードボタンを追加します。
// @include     *://cn.bing.com/
// @include     *://www.bing.com/
// @include     *://www.bing.com/?*
// @include     *://cn.bing.com/?*
// @run-at      document-start
// @version     0.1.7
// @grant       none
// ==/UserScript==

const bingDownloadBtn = {
  //下载按钮
  btnInfo: {
    btnId: 'download-bing-img',
    btnStyles: {
      'color': '',
      'font-size': '1.5em',
      'padding': '0.25em',
      'border-radius': '0.25em',
      'box-shadow': '0 0 3 px rgba(125, 125, 125, 0.25)',
      'right': '20%',
      'top': '12.5%',
      'background-color': '#c3d1cf94',
      'position': 'fixed'
    },
    btnText: function () {
      let text = 'Download Today Bing Picture' //lang en
      switch (navigator.language) {
        case 'zh':
        case 'zh-CN':
        case 'zh-SG':
          text = '下载今日必应图片'
          break;
        case 'zh-TW':
        case 'zh-HK':
          text = '下載今日必應圖片'
          break;
        case 'ko':
        case 'ko_KR':
          text = '오늘 그림을 다운로드합니다'
          break;
        case 'ja':
        case 'ja_JP':
          text = '今日は必ず写真をダウンロードします'
          break
        case 'fr':
        case 'fr_BE':
        case 'fr_CA':
        case 'fr_CH':
        case 'fr_FR':
        case 'fr_LU':
          text = 'Téléchargez les images de bing aujourd’hui'
          break
        default:
          break;
      }
      return text
    }
  },
  //图片信息
  imgInfo: {
    imgUrl: '',
    imgName: "",
    'img-name-rule': {
      'baseName': true,
      'imgNO': false,
      'imgResolution': false
    },
    'img-resolution': '1920x1080' //1366x768 1280x720
  },
  //设置菜单
  menuInfo: {
    menuWrapStyles: {
      'position': 'fixed',
      'z-index': '9',
      'right': '1%',
      'top': '5%'
    },
    resetBtnId: 'reset-menu-settings',
    closeBtnClass: 'close-settings-menu',
    saveBtnId: 'save-menu-settings'
  },
  //本项目信息
  about: {
    github: 'https://github.com/levinit/bing-image-download-button',
    greasyfork: 'https://greasyfork.org/zh-TW/scripts/35070-bing-image-download-button'
  },
  //本地存储菜单中设置的信息 使用的key
  localStoreKey: 'bingImgDownload'
}

window.addEventListener(
  'load',
  function () {
    //进入bing页面后 图片地址写在了一个id为'bgLink'的a元素的href属性中
    const imgUrl = document.getElementById('bgLink').href
    setImgInfo(bingDownloadBtn.imgInfo, imgUrl) //设置图片信息
    console.log(bingDownloadBtn)
    if (imgUrl) {
      getSavedSettings(bingDownloadBtn)  //从本地存储读取设置信息
      addBtn(bingDownloadBtn) //添加下载按钮
      setDownloadInfo(bingDownloadBtn) //绑定更新下载地址和图片名字的事件
    }
  }, {
    once: true
  })

//从本地存储中取得设置的信息写入到bingDownloadBtn各个项中
function getSavedSettings(info) {
  if (localStorage.getItem(info.localStoreKey)) {

    //本地存储的设置信息
    const savedSettings = localStorage.getItem(bingDownloadBtn.localStoreKey)

    const setSettings = function (settingsObj, savedSettingsObj) {
      //遍历本地存储的设置信息，写入到bingDownloadBtn各个项中
      for (const item in savedSettingsObj) {
        if (settingsObj.hasOwnProperty(item)) {
          settingsObj[item] = savedSettingsObj[item]
        }
      }
    }

    //写入按钮设置信息 （按钮样式）
    setSettings(info.btnInfo.btnStyles, savedSettings.btnStyles)

    //写入图片设置信息 （命名规则和分辨率)
    setSettings(info.imgInfo, savedSettings.imgInfo)
  }
}

//-----设置图片信息(图片名和下载地址)
function setImgInfo(imgInfo, imgUrl) {
  // const re = /(?<=id=).+\.(jpg|png)/  //慎用：某些浏览器还不支持向前查找
  // bingDownloadBtn.btnInfo.imgName = /id=.+?\.(jpg|png)/.exec(url)[0].replace('id=', '')
  let url = /id=.+?\.(jpg|png)/.exec(imgUrl)[0].replace('id=', '')
  console.log(url)
  let name = imgInfo.imgName.replace(/^OHR\./, '')//名字去掉前面的OHR.
  // 根据命名规则修改图片名字 图片名字示例 AberystwythSeafront_ZH-CN9542789062_1920x1080.jpg
  for (const rule in imgInfo.imgNameRule) {
    const ruleValue = imgInfo.imgNameRule[rule]
    if (rule) {
      console.log(rule)
      switch (ruleValue) {
        case ruleValue === "imgNO":
          name = name.replace(/_[\w-/]+?\d_/, '_')
          break
        case ruleValue === "imgResolution":
          name = name.replace(/_\d{4}x\d{4}/, '')
          break
        default:
          break
      }
    }
  }
  imgInfo.imgUrl = url
  imgInfo.imgName = name
}

//-------添加下载按钮
function addBtn(info) {
  const btn = document.createElement('a')
  btn.appendChild(document.createTextNode(info.btnInfo.btnText()))

  let btnCssText = ''
  for (let style in info.btnInfo.btnStyles) {
    btnCssText += `${style}:${info.btnInfo.btnStyles[style]};`
  }
  btn.style.cssText = btnCssText

  btn.id = info.btnInfo.btnId
  btn.href = info.imgInfo.imgUrl  //图片下载地址
  btn.download = info.imgInfo.imgName  //图片下载名字
  btn.title = 'right click this button to open settings menu'

  document.body.appendChild(btn)
  //右键打开设置菜单
  btn.oncontextmenu = function (e) {
    e.preventDefault()
    addMenu(info)
  }
}

//-----更新下载信息
function setDownloadInfo(info) {
  document.getElementById(info.btnInfo.btnId).onmouseover = function () {
    //点击了前一天或后一天按钮后 新图片地址将写在id为bgDiv的元素的行内style的background-image属性中
    let newUrl = document.getElementById('bgDiv').style.backgroundImage

    //提取背景图片url（如果没有点击前一天或后一天按钮 background-image不存在 则newUrl内容是空的）
    newUrl = newUrl ? newUrl.substring(5, newUrl.length - 2) : ''

    //比较前后两个url确定是否更新下载图片的地址和名字
    if (newUrl && this.href != location.origin + newUrl) {
      setImgInfo(newUrl) //更新图片信息
      this.href = info.imageInfo.imgUrl
      this.download = info.imgInfo.imgName
    }
  }
}


const menuFn = {
  getSettings() {
    //btn-styles
    const styles = {}
    for (const item of document.querySelectorAll('.btn-style')) {
      let value = item.value
      if (item.value === "" || item.previousElementSibling.type === 'radio' && item.previousElementSibling.checked === false) {
        continue
      }
      const property = item.getAttribute('data-property')
      styles[property] = value
    }


    //img-info
    const imgInfo = {
      'img-name-rule': {}
    }

    for (const item of document.querySelectorAll('.img-info')) {
      if (item.checked === false) {
        continue
      }
      //图片命名规则
      if (item.name === 'img-name-rule') {
        const property = item.getAttribute('data-img-name-rule')
        imgInfo['img-name-rule'][property] = true
      }


      if (item.name === 'img-resolution') {
        imgInfo['img-resolution'] = true
      }

    }
    return { styles, imgInfo }
  },
  //关闭菜单 save和cancel
  closeMenu(menu) {
    menu.style.right = '-100%'
  },
  //保存save
  saveSettings(key, value) {
    localStorage.setItem(key, JSON.stringify(getSavedSettings()))
  },
  //重置reset
  resetSettings(key) {
    localStorage.setItem(key, '')
  }

}

//-----设置菜单
function addMenu(info) {
  const menuInfo = info.menuInfo
  const menuContent = `
  <fieldset id="btn-settings">
    <legend>settings</legend>

    <div class="settings-content">

      <ul class="btn-styles">
        <header>
          Button Style
        </header>
        <li>
          <label>text color:</label>
          <input class="btn-style" data-property="color" type="text" />
        </li>
        <li>
          <label>text font-size:</label>
          <input class="btn-style" data-property="font-size" type="text" />
        </li>
        <li>
          <label>botton background:</label>
          <input class="btn-style" data-property="background" type="text" />
        </li>
        <li>
          <label>button position:</label>
          <ul class="btn-position">
            <li>
              <div>
                <input type="radio" name="horizon" value="left">left
                <input class="btn-style" data-property="left" type="text" />
              </div>
              <div>
                <input type="radio" name="horizon" value="right" checked>right
                <input class="btn-style" data-property="right" type="text" />
              </div>
            </li>
            <li>
              <div>
                <input type="radio" name="vertical" value="top" checked>top
                <input class="btn-style" data-property="top" type="text" />
              </div>
              <div>
                <input type="radio" name="vertical" value="bottom">bottom
                <input class="btn-style" data-property="bottom" type="text" />
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <ul class="img-infos">
        <header>
          Image Info
        </header>
        <li>
          <header>
            Image Name contains:
          </header>
          <div>
            <label>Base-Name</label>
            <input class="img-info" type="checkbox" name="img-name-rule" checked data-img-name-rule="BaseName"
              disabled />
          </div>
          <div>
            <label>Image-NO.</label>
            <input class="img-info" type="checkbox" name="img-name-rule" data-img-name-rule="imgNO" />
          </div>
          <div>
            <label>Image-Resolution.</label>
            <input class="img-info" type="checkbox" name="img-name-rule" data-img-name-rule="ImgResolution" />
          </div>
        </li>
        <li>
          <header>
            Image Resolution
          </header>
          <div>
            <label>1920x1080<small>(Default)</small></label>
            <input class="img-info" type="radio" name="img-resolution" data-img-resolution="1920x1080" checked />
          </div>
          <div>
            <label>1366X768</label>
            <input class="img-info" type="radio" name="img-resolution" data-img-resolution="1366X768" />
          </div>
          <div>
            <label>1280x720</label>
            <input class="img-info" type="radio" name="img-resolution" data-img-resolution="1280x720" />
          </div>
        </li>
        <li class="about">
          <header>About</header>
          <a href="${info.about.github}">GitHub</a>
          <br />
          <a href="${info.about.greasyfork}">GreasyFork</a>
        </li>
      </ul>
    </div>

    <footer>
      <button id="${menuInfo.resetBtnId}" class="reset-btn">reset</button>
      <button id="${menuInfo.saveBtnId}" class="${menuInfo.closeBtnClass}">save</button>
      <button class="${menuInfo.closeBtnClass}">cancel</button>
    </footer>
  </fieldset>
  <style>
    #btn-settings {
      width: 500px;
      border: 1px dashed gainsboro;
      border-radius: 8px;
      box-shadow: 0 0 10px gainsboro;
      background-color: aliceblue;
    }

    #btn-settings legend {
      font-weight: bold;
      text-shadow: 0 0 2px gray;
      color: steelblue;
    }

    .settings-content {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid gainsboro;
      margin-bottom: 0.5em;
    }

    .btn-styles {
      width: 55%;
    }

    #btn-settings ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
    }

    .img-infos {
      width: 40%;
      display: block !important;
    }

    #btn-settings ul>header {
      width: 100%;
      border-bottom: 3px groove gainsboro;
      font-weight: bold;
      color: slategrey;
      text-shadow: 0 0 5px gainsboro;
      margin-bottom: 0.5em;
    }

    #btn-settings li {
      list-style-type: none;
      border-bottom: 1px dashed gainsboro;
      padding-bottom: 0.5em;
    }

    .btn-styles li {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .btn-styles li * {
      width: 95%;
    }

    .btn-position li {
      width: 47.5%;
      margin-right: 2.5%;
      border-bottom: none !important;
    }

    .btn-position li input[type=radio] {
      width: auto;
      height: 20px;
    }

    .btn-position input.btn-style {
      width: 85%;
    }

    .img-infos label {
      width: 80%;
      display: inline-block;
    }

    .img-infos li header {
      color: sienna;
      margin-bottom: 0.25em;
    }

    #btn-settings footer {
      text-align: right;
    }

    #btn-settings footer button {
      width: 88px;
      cursor: pointer;
      font-size: 1.2em;
      font-weight: bold;
      line-height: 1.25;
      text-align: center;
      padding: 0;
      color: teal;
    }

    #btn-settings footer .reset-btn {
      margin-right: 10em;
      color: tomato;
    }

    #btn-settings .about {
      border: 1px dotted gainsboro;
      margin-top: 8em;
      text-align: right;
    }

    #btn-settings .about header {
      color: slategray;
      font-size: 1.25em;
    }
  </style>
  `
  //添加菜单
  const menu = document.createElement('div')

  let cssText = ''
  for (const style in menuInfo.menuWrapStyles) {
    cssText += `${style}:${menuInfo.menuWrapStyles[style]};`
  }
  menu.style.cssText = cssText
  menu.innerHTML = menuContent
  document.body.appendChild(menu)

  //菜单的事件绑定：保存重置和取消
  menu.onclick = function (e) {
    if (e.target.classList.contains(menuInfo.closeBtnClass)) {
      //如果点击的是保存按钮则存储设置的信息
      if (e.target.Id === menuInfo.saveBtnId) {
        menuFn.saveSettings(menuInfo.localStoreKey, JSON.stringify(getSavedSettings()))
      }
      menuFn.closeMenu(menu) //隐藏菜单
    }

    //如果点击的是重置按钮，清空设置
    if (e.target.Id === menuInfo.resetBtnId) {
      menuFn.resetSettings(info.localStoreKey)
    }
  }
}