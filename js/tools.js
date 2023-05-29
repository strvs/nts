$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\)-\d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

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
});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();


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

});

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