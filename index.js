/**
 *
 * @author    XinCheng
 * @since     3/07/2022
 */


const deviceFlag = (function () {
    if ((navigator.userAgent.toLowerCase().match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return false; // mobile
    } else {
        return true; // pc
    }
})();


function getElToPagePosition(el) {
    // 获取该元素到body的距离
    let t = el.offsetTop; // 获取该元素对应父容器的上边距
    let l = el.offsetLeft; // 对应父容器的上边距
    // 判断是否有父容器，如果存在则累加其边距
    while (el = el.offsetParent) {
        // 等效 el = el.offsetParent; while (el != undefined)
        t += el.offsetTop; // 叠加父容器的上边距
        l += el.offsetLeft; // 叠加父容器的左边距
    }
    return { top: parseInt(t), left: parseInt(l) }
}


const vue2DragDirective = {
    install(Vue) {
        function press(evt, el, binding) {

            el.style.cursor = "move";

            const { top, left } = getElToPagePosition(el);

            el.style.top = `${top}px`;
            el.style.left = `${left}px`;

            const e = (evt.targetTouches && evt.targetTouches[0]) || evt;

            const sharedData = {
                isPress: true,
                isMove: false,
                top,
                left,
                pointX: parseInt(e.clientX),
                pointY: parseInt(e.clientY),
            }

            // 绑定其他事件
            if (deviceFlag) {
                document.onmousemove = (_evt) => {
                    move(_evt, el, binding, sharedData)
                };
            } else {
                el.ontouchmove = (_evt) => {
                    move(_evt, el, binding, sharedData)
                };
            }

            el[`${deviceFlag ? "onmouseup" : "ontouchend"}`] = (evt) => {
                lift(evt, el, binding, sharedData)
            };

            const { value } = binding;
            if (value && value.start) {
                const params = { ...sharedData };
                delete params.isPress;
                delete params.isMove;
                value.start(params);
            }
        }

        function move(evt, el, binding, sharedData) {

            const e = (evt.targetTouches && evt.targetTouches[0]) || evt;

            const { isPress, isMove, pointX, pointY, top, left } = sharedData;

            const x = parseInt(e.clientX);
            const y = parseInt(e.clientY); // 鼠标的点位

            if (pointX === x && pointY === y) return;

            const styles = getComputedStyle(el);

            if (isPress) {
                if (!isMove) sharedData.isMove = true;
            } else {
                return;
            }

            if (styles.zIndex !== "999") el.style.zIndex = "999";
            if (styles.transition !== "none") el.style.transition = "none";
            if (styles.position !== "fixed") el.style.position = 'fixed';


            const { body } = document;

            const width = body.offsetWidth - el.offsetWidth;
            const height = body.offsetHeight - el.offsetHeight;


            let offsetTop = parseInt(Number(top) + (y - Number(pointY)));
            let offsetLeft = parseInt(Number(left) + (x - Number(pointX)));  // 偏移量

            const { value } = binding;

            const isBeyondDocument = value && value.isBeyondDocument;

            if (!isBeyondDocument) {
                offsetTop = offsetTop > 0 ? offsetTop > height ? height : offsetTop : 0;

                offsetLeft = offsetLeft > 0 ? offsetLeft > width ? width : offsetLeft : 0;
            }

            el.style.top = `${offsetTop}px`;
            el.style.left = `${offsetLeft}px`;

            if (value && value.moving) {
                value.moving({ pointX: x, pointY: y, offsetTop, offsetLeft });
            }

        }

        function lift(evt, el, binding, sharedData) {

            sharedData.isPress = false;

            const { isMove } = sharedData;
            if (!isMove) {
                el.style.position = '';
            } else {
                el.style.zIndex = "";
                el.style.transition = "";
            }
            el.style.cursor = "pointer";

            // 解绑事件
            if (deviceFlag) {
                document.onmousemove = null;
                document.onmouseup = null;

            } else {
                el.ontouchmove = null;
                el.ontouchend = null;
            }

            const { value } = binding;
            if (value && value.end) {
                const e = (evt.targetTouches && evt.targetTouches[0]) || evt;

                value.end({ pointX: parseInt(e.clientX), pointY: parseInt(e.clientY), top: el.offsetTop, left: el.offsetLeft });
            }
        }

        Vue.directive('drag', {
            bind(el, binding) {
                if (deviceFlag) {
                    el.style.cursor = "pointer";
                    el.style.userSelect = "none";
                    el.draggable = false; // 防止图片等默认的拖拽，但无法影响到子元素
                }

                el.addEventListener(`${deviceFlag ? "mousedown" : "touchstart"}`, (evt) => {
                    press(evt, el, binding)
                });

            },
        });
    }
}

/*
 * Exports
 */
if (typeof module === 'object') {
    module.exports = vue2DragDirective;

} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        return vue2DragDirective;
    });
} else if (window.Vue) {
    window.vue2DragDirective = vue2DragDirective;
    Vue.use(vue2DragDirective);
}

