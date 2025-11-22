// About page describing the platform's mission, features, and capabilities

import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, GraduationCap, Network, TrendingUp, User, Sparkles, Shield, Mail, FileText, ExternalLink } from "lucide-react";

export function AboutPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8 md:pb-12">
      <Card className="shadow-md bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
        <CardContent className="p-6 md:p-8 lg:p-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h1 className="scroll-m-20 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Фонд Права — деловая сеть для юридического сообщества
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
              Наша миссия состоит в объединении юристов, повышении их профессиональной
              активности и эффективности
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Участники
          </h2>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            <p className="text-sm md:text-base leading-relaxed">
              Фонд Права ориентирован на юристов, юридические фирмы, выпускников юридических факультетов, а
              также сообщества и объединения. Мы понимаем вызовы и потребности юридического сообщества.
            </p>
            <p className="text-sm md:text-base leading-relaxed">
              Также приглашаются специалисты смежных отраслей, эксперты, оценщики, медиаторы для создания
              обширного профессионального сообщества.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Что предлагает платформа
          </h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Доверие и узнаваемость</h3>
                  <p className="text-muted-foreground leading-7">
                    В юридической сфере репутация – главная валюта. Платформа способствует построению крепкой репутации.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Персональный профиль</h4>
                      <p className="text-sm text-muted-foreground">
                        Цифровая визитная карточка в профессиональном сообществе.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Лента публикаций</h4>
                      <p className="text-sm text-muted-foreground">
                        Демонстрация экспертизы, аналитические статьи, кейсы. Получить признание в своей нише.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Верификация</h4>
                      <p className="text-sm text-muted-foreground">
                        Система подтверждения экспертности, навыков, кейсов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Кадровый центр</h3>
                  <p className="text-muted-foreground leading-7">
                    Готовая инфраструктура для проведения кадровых конкурсов и отборов.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Разработка заданий (шаблоны), тестирование участников, итоговая статистика, настройки доступа к результатам (проверяющие,
                    работодатели и др.).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Network className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Нетворк нового уровня</h3>
                  <p className="text-muted-foreground leading-7">
                    Не просто список контактов, а динамичная сеть возможностей.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Карта связей</h4>
                      <p className="text-sm text-muted-foreground">
                        Визуализация подписок и профессиональных связей, оценка
                        точек пересечения и новых возможностей для
                        сотрудничества. Приватная сеть.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Клубы</h4>
                      <p className="text-sm text-muted-foreground">
                        Присоединяйтесь к экспертным группам. Обменивайтесь
                        опытом, обсуждайте сложные кейсы и находите партнеров
                        для совместных проектов.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">Развитие бизнеса</h3>
                  <p className="text-muted-foreground leading-7">
                    Инструменты для проактивного развития юридической фирмы и управления клиентскими потоками.
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-1">Трекинг</h4>
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        <div className="text-sm">
                          <strong className="text-foreground">PR (Public Relations)</strong>
                          <p className="text-muted-foreground">Цифровые ресурсы, участие в мероприятиях, демонстрация экспертизы</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">MR (Marketing Research)</strong>
                          <p className="text-muted-foreground">Позиционирование, ценообразование, каналы привлечения клиентов</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">GR (Government Relations)</strong>
                          <p className="text-muted-foreground">Вхождение в составы профессиональных сообществ, общественных
                          советов и экспертных групп</p>
                        </div>
                        <div className="text-sm">
                          <strong className="text-foreground">HR (Human Resources)</strong>
                          <p className="text-muted-foreground">Формирование команды и привлечение новых кадров</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            SaaS и AI-сервисы
          </h2>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            <p className="text-sm md:text-base leading-relaxed">
              Единая экосистема профессиональных инструментов для юридической практики. Вместо поиска,
              анализа и покупки отдельных дорогостоящих решений — одна подписка на все необходимые сервисы.
            </p>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4 mt-4">
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Каталог юридических услуг</h4>
                <p className="text-sm text-muted-foreground">
                  Структурированная база юридических ресурсов с возможностью поиска по регионам и специализациям.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Split — калькулятор расчётов</h4>
                <p className="text-sm text-muted-foreground">
                  Автоматизированный расчёт и разделение оплат между участниками, генерация платёжных ссылок.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Проверка контрагентов</h4>
                <p className="text-sm text-muted-foreground">
                  Комплексный анализ компаний: юридические данные, финансовые показатели, риски и репутация.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Мониторинг судебных дел</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered отслеживание судебных процессов с автоматическими уведомлениями и аналитикой.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">CRM для юристов</h4>
                <p className="text-sm text-muted-foreground">
                  Управление клиентами, делами и документооборотом в единой системе с интеграциями.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Конструктор документов</h4>
                <p className="text-sm text-muted-foreground">
                  Автоматизированная генерация юридических документов на основе шаблонов и AI-ассистента.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Правовая аналитика</h4>
                <p className="text-sm text-muted-foreground">
                  AI-анализ законодательства, судебной практики и правовых позиций для подготовки дел.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Онлайн-консультации</h4>
                <p className="text-sm text-muted-foreground">
                  Защищённая платформа для видеоконференций и обмена документами с клиентами.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                💡 Все сервисы интегрированы, работают на единой платформе и постоянно совершенствуются
                с применением искусственного интеллекта для повышения эффективности юридической практики.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Shield className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Безопасность и конфиденциальность
          </h2>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            <p className="text-sm md:text-base leading-relaxed">
              Мы понимаем критическую важность защиты данных в юридической практике и применяем
              передовые стандарты безопасности.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Шифрование данных</h4>
                <p className="text-sm text-muted-foreground">
                  End-to-end шифрование всех коммуникаций и хранимых документов для защиты
                  конфиденциальной информации.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Контроль доступа</h4>
                <p className="text-sm text-muted-foreground">
                  Гранулярное управление правами доступа, двухфакторная аутентификация и
                  аудит всех действий пользователей.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Соответствие стандартам</h4>
                <p className="text-sm text-muted-foreground">
                  Соблюдение требований законодательства о персональных данных и профессиональной
                  этики адвокатов.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Резервное копирование</h4>
                <p className="text-sm text-muted-foreground">
                  Автоматическое создание резервных копий с возможностью восстановления данных
                  в любой момент времени.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Приватность по умолчанию</h4>
                <p className="text-sm text-muted-foreground">
                  Все профили и данные приватны по умолчанию — вы сами решаете, что и кому показывать.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Mail className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Контакты и правовая информация
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold">Связаться с нами</h3>
                  <a
                    href="mailto:info@fondprava.ru"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    info@fondprava.ru
                  </a>
                  <a
                    href="mailto:support@fondprava.ru"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support@fondprava.ru
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold">Сотрудничество</h3>
                  <a
                    href="mailto:partnership@fondprava.ru"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    partnership@fondprava.ru
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Правовые документы</h3>
                  <div className="space-y-1">
                    <a
                      href="/terms"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Пользовательское соглашение
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="/privacy"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Политика конфиденциальности
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="/cookies"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Политика использования cookie
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  © 2024 Фонд Права. Все права защищены. <br />
                  ИНН: 1234567890 | ОГРН: 1234567890123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md bg-muted/30">
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Юридическая информация:</strong> Использование платформы
              регулируется действующим законодательством Российской Федерации. Все материалы и сервисы
              предоставляются в информационных целях и не являются юридической консультацией.
              Для получения профессиональной юридической помощи обратитесь к квалифицированному специалисту.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
