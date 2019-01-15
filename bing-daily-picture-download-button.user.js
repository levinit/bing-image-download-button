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

//todo 自定义样式

const btnInfo = {
  imgUrl: '',
  imgName: '',
  btnId: 'download-bing-img',
  btnStyle: {
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
}

window.addEventListener(
  'load',
  function () {
    //进入bing页面后 图片地址写在了一个id为'bgLink'的a元素的href属性中
    const initUrl = document.getElementById('bgLink').href
    if (initUrl) {
      getImg(initUrl) //获取图片信息
      addBtn(btnInfo) //添加按钮
      refreshBtn(btnInfo) //绑定更新下载地址和图片名字的事件
    }
  }, {
    once: true
  })

//-----获取图片信息
function getImg(url) {
  btnInfo.imgUrl = url
  // const re = /(?<=id=).+\.(jpg|png)/  //慎用：某些浏览器还不支持向前查找
  btnInfo.imgName = /id=.+?\.(jpg|png)/.exec(url)[0].replace('id=', '')
}

//-------添加下载按钮
function addBtn(info) {
  const btn = document.createElement('a')
  btn.appendChild(document.createTextNode(info.btnText()))

  let cssText = ''
  for (let style in info.btnStyle) {
    cssText += `${style}:${info.btnStyle[style]};`
  }
  btn.style.cssText = cssText

  btn.id = info.btnId
  btn.href = info.imgUrl
  btn.title = btn.download = info.imgName

  document.body.appendChild(btn)
}

//-----更新下载按钮
function refreshBtn(info) {
  document.getElementById(info.btnId).onmouseover = function () {
    //从id为bgDiv的元素上获取图片地址
    //点击了前一天或后一天按钮后 新图片地址将写在行内style的background-image属性中
    let newUrl = document.getElementById('bgDiv').style.backgroundImage

    //提取背景图片url（如果没有点击前一天或后一天按钮 background-image不存在 则newUrl内容是空的）
    newUrl = newUrl ? newUrl.substring(5, newUrl.length - 2) : ''

    //比较前后两个url确定是否更新下载图片的地址和名字
    if (newUrl && this.href != location.origin + newUrl) {
      getImg(newUrl) //更新图片信息
      this.href = info.imgUrl
      this.download = info.imgName
    }
  }
}