// About page describing the platform's mission, features, and capabilities

import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, GraduationCap, Network, TrendingUp, User, Sparkles, Target, FileText, ExternalLink } from "lucide-react";

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
              Также приглашаются специалисты смежных отраслей, эксперты, оценщики, медиаторы для сотрудничества и создания
              обширного профессионального объединения.
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4">
              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Каталог юридических услуг</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Split</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Проверка контрагентов</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Мониторинг судебных дел</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">CRM для юристов</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Конструктор документов</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Правовая аналитика</h4>
              </div>

              <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 hover:shadow-md transition-all">
                <h4 className="font-semibold text-sm md:text-base text-center">Онлайн-консультации</h4>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
              <p className="text-sm font-medium text-center">
                Все сервисы интегрированы, работают на единой платформе и постоянно совершенствуются
                с применением искусственного интеллекта для повышения эффективности юридической практики.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Target className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          <h2 className="scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Наши ценности
          </h2>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            <p className="text-sm md:text-base leading-relaxed">
              Мы создаем платформу, которая отражает лучшие традиции юридического сообщества и
              современные стандарты цифрового взаимодействия.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Профессионализм</h4>
                <p className="text-sm text-muted-foreground">
                  Создание пространства для обмена опытом, развития экспертизы и повышения
                  стандартов юридической практики.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Открытость</h4>
                <p className="text-sm text-muted-foreground">
                  Прозрачность в работе платформы, открытый диалог с сообществом и постоянное
                  развитие на основе обратной связи.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Инновации</h4>
                <p className="text-sm text-muted-foreground">
                  Внедрение современных технологий для упрощения рутинных задач и фокуса на
                  интеллектуальной работе.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Этика и конфиденциальность</h4>
                <p className="text-sm text-muted-foreground">
                  Строгое соблюдение адвокатской тайны, защита персональных данных и уважение
                  профессиональных стандартов.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Сообщество</h4>
                <p className="text-sm text-muted-foreground">
                  Поддержка взаимопомощи, наставничества и коллаборации между юристами разных
                  уровней и специализаций.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-12 pt-8 border-t">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">© 2025 Фонд Права</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
              <a
                href="mailto:info@fondprava.ru"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                info@fondprava.ru
              </a>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Пользовательское соглашение
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Политика конфиденциальности
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <a
                href="/cookies"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            Использование платформы регулируется действующим законодательством Российской Федерации.
            Все материалы и сервисы предоставляются в информационных целях и не являются юридической консультацией.
          </div>
        </div>
      </footer>
    </div>
  );
}
