$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\)-\d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input strong').html(curName);
        } else {
            curField.find('.form-file-input strong').html(curField.find('.form-file-input').attr('data-placeholder'));
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.header-burger-link').click(function(e) {
        $('html').addClass('burger-open');
        e.preventDefault();
    });

    $('.header-fixed-burger-link').click(function(e) {
        $('html').addClass('burger-open');
        e.preventDefault();
    });

    $('.nav-close').click(function(e) {
        $('html').removeClass('burger-open');
        e.preventDefault();
    });

    $('.projects-menu-mobile-link').click(function(e) {
        var curScroll = $(window).scrollTop();
        $('html').data('scrollTop', curScroll);
        $('html').addClass('projects-menu-open');
        e.preventDefault();
    });

    $('.projects-menu-mobile-close').click(function(e) {
        $('html').removeClass('projects-menu-open');
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.page-menu').each(function() {
        var curIndex = $(this);
        curIndex.find('ol').remove();
        curIndex.append('<ol></ol>');
        var curNumber = 0;
        $('.page-section').each(function() {
            var curSection = $(this);
            curIndex.find('ol').append('<li><a href="#" data-sectionid="' + curNumber + '">' + curSection.attr('data-title') + '</a></li>');
            curNumber++;
        });
    });

    $('body').on('click', 'a[data-sectionid]', function(e) {
        var curBlock = $('.page-section').eq($(this).attr('data-sectionid'));
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top - 40});
        }
        e.preventDefault();
    });

    $('.docs-group-title').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.tech-negative-faq-item-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.tech-negative-video-player-link').click(function(e) {
        var curPlayer = $(this).parent();
        curPlayer.find('.tech-negative-video-player-iframe').html('<iframe width="560" height="315" src="' + $(this).attr('href') + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>');
        $(this).hide();
        curPlayer.find('.tech-negative-video-player-iframe').show();
        e.preventDefault();
    });

    $('.project-gallery').each(function() {
        var curGallery = $(this);
        var countItems = curGallery.find('.project-gallery-item').length;
        if (countItems > 7) {
            curGallery.find('.project-gallery-item').eq(6).append('<div class="project-gallery-item-more"><span>+' + (countItems - 7) + '</span></div>')
        }
    });

    $('body').on('click', '[data-lightbox]', function(e) {
        var curItem = $(this);
        var curGroup = curItem.attr('data-lightbox');
        if (curGroup == '') {
            var curGallery = curItem;
        } else {
            var curGallery = $('[data-lightbox="' + curGroup + '"]');
        }
        var curIndex = curGallery.index(curItem);

        var curWidth = $(window).width();

        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-photo-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        var windowHTML =    '<div class="window-photo">';

        var galleryLength = curGallery.length;
        if (galleryLength > 1) {
            windowHTML +=       '<div class="window-photo-preview">' +
                                    '<div class="window-photo-preview-inner">' +
                                        '<div class="window-photo-preview-list">';

            for (var i = 0; i < galleryLength; i++) {
                var curGalleryItem = curGallery.eq(i);
                var curIMG = '';
                if (curGalleryItem.find('img').length > 0) {
                    curIMG = curGalleryItem.find('img').eq(0).attr('src');
                } else if (curGalleryItem.find('[style*="background-image"]').length > 0) {
                    curIMG = curGalleryItem.find('[style*="background-image"]').eq(0).css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");;
                } else {
                    curIMG = curGalleryItem.attr('href');
                }
                if (typeof(curGalleryItem.attr('data-view360')) != 'undefined') {
                    windowHTML +=           '<div class="window-photo-preview-list-item window-photo-preview-list-item-360"><a href="#" style="background-image:url(' + curIMG + ')"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#multi-panels-item-360"></use></svg></a></div>';
                } else {
                    windowHTML +=           '<div class="window-photo-preview-list-item"><a href="#" style="background-image:url(' + curIMG + ')"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#zoom"></use></svg></a></div>';
                }
            }
            windowHTML +=               '</div>' +
                                    '</div>' +
                                '</div>';
        }

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';

        windowHTML +=           '<div class="window-photo-slider">' +
                                    '<div class="window-photo-slider-list">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item">' +
                                            '<div class="window-photo-slider-list-item-inner">';
            if (typeof(curGalleryItem.attr('data-title')) != 'undefined') {
                windowHTML +=                   '<div class="window-photo-slider-list-item-title">' + curGalleryItem.attr('data-title') + '</div>';
            }
            if (typeof(curGalleryItem.attr('data-text')) != 'undefined') {
                windowHTML +=                   '<div class="window-photo-slider-list-item-text">' + curGalleryItem.attr('data-text') + '</div>';
            }
            if (typeof(curGalleryItem.attr('data-view360')) != 'undefined') {
                windowHTML +=                   '<div class="window-photo-slider-list-item-view360" data-folder="' + curGalleryItem.attr('data-view360-folder') +'" data-filename-x="' + curGalleryItem.attr('data-view360-filename-x') +'" data-amount-x="' + curGalleryItem.attr('data-view360-amount-x') +'"></div>';
            } else {
                windowHTML +=                   '<div class="window-photo-slider-list-item-img"><img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgc3R5bGU9Im1hcmdpbjogYXV0bzsgYmFja2dyb3VuZDogbm9uZTsgZGlzcGxheTogYmxvY2s7IHNoYXBlLXJlbmRlcmluZzogYXV0bzsgYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7IiB3aWR0aD0iOTFweCIgaGVpZ2h0PSI5MXB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPg0KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA0N0ZGIiBzdHJva2Utd2lkdGg9IjEwIiByPSIzNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTY0LjkzMzYxNDMxMzQ2NDE1IDU2Ljk3Nzg3MTQzNzgyMTM4IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4NCiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIiBrZXlUaW1lcz0iMDsxIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+DQo8L2NpcmNsZT4NCjwhLS0gW2xkaW9dIGdlbmVyYXRlZCBieSBodHRwczovL2xvYWRpbmcuaW8vIC0tPjwvc3ZnPg==" data-src="' + curGalleryItem.attr('href') + '"></div>';
            }

            windowHTML +=                   '</div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        $('.window-photo-preview-list-item').eq(curIndex).addClass('active');

        $('.window-photo-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            speed: 250,
            initialSlide: curIndex,
            asNavFor: '.window-photo-preview-list'
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.window-photo-slider-list').slick('slickCurrentSlide');
            $('.window-photo-preview-list-item.active').removeClass('active');
            $('.window-photo-preview-list-item').eq(currentSlide).addClass('active');
            if ($('.window-photo-slider-list-item').eq(currentSlide).find('.window-photo-slider-list-item-view360').length == 1) {
                var cur360 = $('.window-photo-slider-list-item').eq(currentSlide).find('.window-photo-slider-list-item-view360');
                if (!cur360.hasClass('ready')) {
                    var cur360Count = Number(cur360.attr('data-amount-x'));
                    for (var i = 0; i < cur360Count; i++) {
                        cur360.append('<img src="' + (cur360.attr('data-folder') + cur360.attr('data-filename-x').replace('{index}', (i + 1))) + '" alt="">');
                    }
                    cur360.find('img').eq(0).addClass('active');
                    cur360.append('<div class="window-photo-slider-list-item-view360-ctrl"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#multi-panels-item-360"></use></svg><input type="range" class="window-photo-view360-range" name="range-360-' + currentSlide + '" value="1" min="1" max="' + cur360Count + '" step="1"></div>');
                    cur360.addClass('ready');
                }
            } else {
                var curIMG = $('.window-photo-slider-list-item').eq(currentSlide).find('img');
                if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                    var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                    $('body').append(newIMG);
                    newIMG.one('load', function(e) {
                        curIMG.attr('src', curIMG.attr('data-src'));
                        newIMG.remove();
                    });
                    newIMG.attr('src', curIMG.attr('data-src'));
                    window.setTimeout(function() {
                        curIMG.attr('src', curIMG.attr('data-src'));
                        if (newIMG) {
                            newIMG.remove();
                        }
                    }, 3000);
                }
            }
        });

        if (galleryLength > 1) {
            $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
            var windowHeight = $('#body-test-height').height();
            $('#body-test-height').remove();
            var previewCount = Math.floor((windowHeight - 258) / 146);

            if (previewCount < $('.window-photo-preview-list-item').length) {
                $('.window-photo-preview-list').slick({
                    infinite: false,
                    slidesToShow: previewCount,
                    slidesToScroll: 1,
                    initialSlide: curIndex,
                    prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-preview-prev"></use></svg>Листай</button>',
                    nextArrow: '<button type="button" class="slick-next">Листай<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-preview-next"></use></svg></button>',
                    vertical: true,
                    asNavFor: '.window-photo-slider-list'
                });
            }
        }

        e.preventDefault();
    });

    var view360Range = null;
    var view360Timer = null;

    function view360Update() {
        var curBlock = view360Range;
        var curInput = curBlock.find('.window-photo-view360-range');
        var curValue = Number(curInput.val());
        curBlock.find('img.active').removeClass('active');
        curBlock.find('img').eq(curValue - 1).addClass('active');
    }

    $('body').on('mouseenter', '.window-photo-slider-list-item-view360-ctrl', function() {
        $('.window-photo-slider-list').slick('slickSetOption', 'draggable', false);
        view360Range = $(this).parent();
        view360Timer = window.setInterval(view360Update, 100);
    });

    $('body').on('mouseleave', '.window-photo-slider-list-item-view360-ctrl', function() {
        $('.window-photo-slider-list').slick('slickSetOption', 'draggable', true);
        view360Range = null;
        window.clearInterval(view360Timer);
        view360Timer = null;
    });

    $('body').on('touchstart', '.window-photo-slider-list-item-view360-ctrl', function() {
        $('.window-photo-slider-list').slick('slickSetOption', 'swipe', false);
        $('.window-photo-slider-list').slick('slickSetOption', 'touchMove', false);
        view360Range = $(this).parent();
        view360Timer = window.setInterval(view360Update, 100);
    });

    $('body').on('touchend', '.window-photo-slider-list-item-view360-ctrl', function() {
        $('.window-photo-slider-list').slick('slickSetOption', 'swipe', true);
        $('.window-photo-slider-list').slick('slickSetOption', 'touchMove', true);
        view360Range = null;
        window.clearInterval(view360Timer);
        view360Timer = null;
    });

    $('body').on('click', '.window-photo-preview-list-item a', function(e) {
        var curIndex = $('.window-photo-preview-list-item').index($(this).parent());
        $('.window-photo-slider-list').slick('slickGoTo', curIndex);
        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('.about-block-video-player-link').click(function(e) {
        var curPlayer = $('.about-block');
        curPlayer.find('.about-block-video-player-iframe').html('<iframe width="560" height="315" src="' + $(this).attr('href') + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>');
        curPlayer.find('.about-block-video-player-iframe').show();
        e.preventDefault();
    });

    $('.about-partner-descr-more a').click(function(e) {
        $('.about-partner-text').toggleClass('open');
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000)-000-00-00');

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('window-form')) {
                var formData = new FormData(form);

                windowOpen(curForm.attr('action'), formData);
            } else {
                form.submit();
            }
        }
    });
}

$(window).on('load resize', function() {
    $('.main-new-tech').each(function() {
        $('.main-new-tech').css({'height': $('.main-new-tech-inner').outerHeight()});
    });
    $('.about-partner-photo').each(function() {
        $('.about-partner-photo').css({'height': $('.about-partner-photo-inner').outerHeight()});
    });

    $('.about-partner-text').each(function() {
        $('.about-partner-text').removeClass('open');
        $('.about-partner-descr-more').removeClass('visible');
        if ($('.about-partner-descr').height() < $('.about-partner-descr-inner').height()) {
            $('.about-partner-descr-more').addClass('visible');
        }
    });
});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if (windowScroll > $('header').outerHeight()) {
        $('.header-fixed').addClass('visible');
    } else {
        $('.header-fixed').removeClass('visible');
    }

    if ($('.main-new-tech').length == 1) {
        if (windowScroll + windowHeight >= $('.main-types').offset().top) {
            $('.main-new-tech').addClass('fixed');
            $('.main-new-tech-inner').css({'top': (windowHeight - $('.main-new-tech').outerHeight()) + 'px'});
        } else {
            $('.main-new-tech').removeClass('fixed');
            $('.main-new-tech-inner').css({'top': 'auto'});
        }
    }

    $('.about-partner-photo').each(function() {
        if (windowScroll > $('.about-partner-photo').offset().top) {
            $('.about-partner-photo').addClass('fixed');
            if (windowScroll + $('.about-partner-photo-inner').outerHeight() > $('.about-partner-container').offset().top + $('.about-partner-container').outerHeight()) {
                $('.about-partner-photo-inner').css({'margin-top': -((windowScroll + $('.about-partner-photo-inner').outerHeight()) - ($('.about-partner-container').offset().top + $('.about-partner-container').outerHeight())) + 'px'});
            } else {
                $('.about-partner-photo-inner').css({'margin-top': 0});
            }
        } else {
            $('.about-partner-photo').removeClass('fixed');
            $('.about-partner-photo-inner').css({'margin-top': 0});
        }
    });

    $('body').on('click', '.window-download-resend-text a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('disabled')) {
            curLink.addClass('disabled');
            $('.window .window-download-step1 form').each(function() {
                var curForm = $(this);
                var formData = new FormData(curForm[0]);
                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    timeout: 30000
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    curLink.removeClass('disabled');
                    alert('Сервис временно недоступен, попробуйте позже.');
                }).done(function(data) {
                    if (data.status) {
                        reSMSperiod = data.timer + 1;
                        window.clearTimeout(reSMSTimer);
                        reSMSTimer = null;
                        updateTimerSMS();
                        $('.window-download-resend-text a').addClass('disabled');
                    } else {
                        curLink.removeClass('disabled');
                        alert(data.error);
                    }
                });
            });
        }
        e.preventDefault();
    });

});

var reSMSperiod = 120;
var reSMSTimer = null;

function updateTimerSMS() {
    reSMSperiod--;
    var newText = '';
    if (reSMSperiod > 60) {
        var countMinutes = Math.floor(reSMSperiod / 60);
        newText = ('0' + String(countMinutes)).substr(-2) + ':' + ('0' + String(reSMSperiod - countMinutes * 60)).substr(-2);
    } else {
        newText = '00:' + ('0' + String(reSMSperiod)).substr(-2);
    }
    $('.window-download-resend-text span').html(newText);
    if (reSMSperiod <= 0) {
        $('.window-download-resend-text a').removeClass('disabled');
    } else {
        reSMSTimer = window.setTimeout(updateTimerSMS, 1000);
    }
}


function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        $('.window form').each(function() {
            initForm($(this));
        });

        $('.window .window-download-step1 form').each(function() {
            var curForm = $(this);
            var validator = curForm.validate();
            if (validator) {
                validator.destroy();
            }
            curForm.find('.form-input input').attr('autocomplete', 'off');
            curForm.validate({
                ignore: '',
                submitHandler: function(form) {
                    if (!curForm.hasClass('disabled')) {
                        var formData = new FormData(form);
                        curForm.addClass('loading');
                        $.ajax({
                            type: 'POST',
                            url: curForm.attr('action'),
                            processData: false,
                            contentType: false,
                            data: formData,
                            dataType: 'json',
                            cache: false,
                            timeout: 30000
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            curForm.removeClass('loading');
                            alert('Сервис временно недоступен, попробуйте позже.');
                        }).done(function(data) {
                            curForm.removeClass('loading');
                            curForm.addClass('disabled');
                            if (data.status) {
                                reSMSperiod = data.timer + 1;
                                window.clearTimeout(reSMSTimer);
                                reSMSTimer = null;
                                updateTimerSMS();
                                $('.window-download-resend-text').show();
                                $('.window-download-resend-text a').addClass('disabled');
                                $('.window-download-step2').show();
                            } else {
                                alert(data.error);
                            }
                        });
                    }
                }
            });
        });

        $('.window .window-download-step2 form').each(function() {
            var curForm = $(this);
            var validator = curForm.validate();
            if (validator) {
                validator.destroy();
            }
            curForm.find('.form-input input').attr('autocomplete', 'off');
            curForm.validate({
                ignore: '',
                submitHandler: function(form) {
                    if (!curForm.hasClass('disabled')) {
                        var formData = new FormData(form);
                        curForm.addClass('loading');
                        $.ajax({
                            type: 'POST',
                            url: curForm.attr('action'),
                            processData: false,
                            contentType: false,
                            data: formData,
                            dataType: 'json',
                            cache: false,
                            timeout: 30000
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            curForm.removeClass('loading');
                            alert('Сервис временно недоступен, попробуйте позже.');
                        }).done(function(data) {
                            curForm.removeClass('loading');
                            if (data.status) {
                                var params = data;
                                $.ajax({
                                    url: params.link,
                                    dataType: 'binary',
                                    xhrFields: {
                                        'responseType': 'blob'
                                    },
                                    success: function(data, status, xhr) {
                                        var blob = new Blob([data], {type: xhr.getResponseHeader('Content-Type')});
                                        var link = document.createElement('a');
                                        link.href = window.URL.createObjectURL(blob);
                                        link.download = params.title;
                                        link.click();
                                    }
                                });
                            } else {
                                alert(data.error);
                            }
                        });
                    }
                }
            });
        });

        $(window).trigger('resize');
    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}