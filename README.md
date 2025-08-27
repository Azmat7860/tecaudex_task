<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sales Tracking Backend

A NestJS + PostgreSQL backend for managing users (sales representatives), recording sales, and calculating commissions with complex business rules.

---

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Edit `.env` to set your PostgreSQL credentials and desired port.
   - Example:
     ```env
     NODE_ENV=development
     PORT=3000
     DB_TYPE=postgres
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=youruser
     DB_PASSWORD=yourpassword
     DB_DATABASE=yourdb
     ```
4. **Run database migrations (if using migrations):**
   ```bash
   npm run typeorm migration:run
   ```
   (Or let TypeORM sync entities automatically if configured)
5. **Start the server:**
   ```bash
   npm run start:dev
   ```
   The server will start on `http://localhost:3000` (or your configured port).

---

## API Endpoints

### Users
- **POST /api/users**: Create a sales representative
  - Body: `{ name, email, region, hire_date }`
- **GET /api/users**: List users
  - Optional query params: `region`, `status`

### Sales
- **POST /api/sales**: Record a sale
  - Body: `{ user_id, amount, date, product_category }`
  - Calculates commission automatically
- **POST /api/sales/bulk**: Import multiple sales
  - Body: `[{ user_id, amount, date, product_category }, ...]`

---

## Commission Calculation Approach

When a sale is recorded, the commission rate is computed as follows:
- **Base Commission:** 5% of monthly sales
- **Tier Bonuses:**
  - Monthly sales > $10,000: +2%
  - Monthly sales > $25,000: +4% (replaces +2%)
- **Regional Multipliers:**
  - North: 1.1x
  - South: 0.95x
  - East: 1.0x
  - West: 1.05x
- **Streak Bonus:** +1% for each consecutive month hitting target (max 5%)
- **Performance Penalty:** -2% if previous month was below 50% of target

_Commission is clamped between 0% and 20%._

> **Note:** The monthly target is currently hardcoded as `$10,000` for demonstration. Adjust as needed for real business logic.

---

## Notes on AI Tool Usage vs. Human Reasoning

- **AI Assistance:**
  - Cascade AI was used to automate code scaffolding, boilerplate, and to ensure best practices for NestJS and TypeORM integration.
  - AI generated the initial commission logic and controller/service structure based on requirements.
- **Human Reasoning:**
  - Business rules were interpreted and clarified by the developer.
  - Edge cases and real-world adjustments (e.g., streak logic, penalty application, target configuration) were reviewed and adjusted as needed.
  - Database schema and DTOs were aligned with actual business needs.

---

## Further Improvements
- Add authentication/authorization
- Implement dynamic monthly targets per user
- Add pagination and advanced filtering to user/sales endpoints
- Improve error handling and validation

---

## License

MIT

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
